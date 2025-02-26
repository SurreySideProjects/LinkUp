import hashlib
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from pymongo import MongoClient
from bson.json_util import dumps
import os
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit, join_room, send, leave_room

load_dotenv()
MONGO_URL = os.getenv('MONGO_URL')
SECRET_KEY = os.getenv('JWT_KEY')

app = Flask(__name__)
CORS(app, supports_credentials=True, origins='*', headers=['Content-Type', 'Authorization'], expose_headers='Authorization')
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=7) #Token expires in 7 days

#WebSockets
socketio = SocketIO(app, cors_allowed_origins="*")

#DB Connection
client = MongoClient(MONGO_URL)
db = client["PartyVerse"]
users_collection = db["users"]
groups_collection = db["groups"]
groupUsers_collection = db["groupUsers"]
events_collection = db["events"]
groupMessages_collection = db["groupMessages"]

#-----------------USERS SECTION------------
@app.route("/api/v1/users", methods=["POST"])
def register():
	new_user = request.get_json() # store the json body request
	new_user["password"] = hashlib.sha256(new_user["password"].encode("utf-8")).hexdigest() # encrpt password
	doc = users_collection.find_one({"username": new_user["username"]}) # check if user exist
	print(new_user)
	if not doc:
		users_collection.insert_one(new_user)
		return jsonify({'msg': 'User created successfully'}), 201
	else:
		return jsonify({'msg': 'Username already exists'}), 409

@app.route("/api/v1/login", methods=["POST"])
def login():
	login_details = request.get_json() # store the json body request
	user_from_db = users_collection.find_one({'username': login_details['username']})  # search for user in database
	if user_from_db and user_from_db['verified'] == True:
		encrpted_password = hashlib.sha256(login_details['password'].encode("utf-8")).hexdigest()
		if encrpted_password == user_from_db['password']:
			access_token = create_access_token(identity=user_from_db['username']) # create jwt token
			return jsonify(access_token=access_token), 200

	return jsonify({'msg': 'The username or password is incorrect'}), 401

@app.route("/api/v1/user", methods=["GET", "POST"])
@jwt_required(optional=True)
def profile():
	current_user = get_jwt_identity() # Get the identity of the current user
	user_from_db = users_collection.find_one({'username' : current_user})
	if user_from_db:
		del user_from_db['_id'], user_from_db['password'] # delete data we don't want to return
		return jsonify({'profile' : user_from_db['username'] }), 200
	else:
		return jsonify({'msg': 'Profile not found'}), 404


##### GROUP and GROUPUSER
@app.route("/api/v1/createGroup", methods=["POST"]) # for now, gorups have primary key of name, but will change later
# @jwt_required()
def create_group():
	new_group = request.get_json()
	doc = groups_collection.find_one({"name": new_group["name"]}) # check if group exist
	creater = users_collection.find_one({'username' : new_group["username"]})
	new_group["userID"] = creater["_id"]
	new_group["numOfMembers"] = 1

	
	if not doc:
		del new_group["username"]
		result = groups_collection.insert_one(new_group)
		new_groupUser = { 
			"groupID": result.inserted_id,
			"userID": creater["_id"],
			"role": "admin",
		}
		groupUsers_collection.insert_one(new_groupUser)
		return jsonify({'msg': 'Group was created successfully'}), 200
	else:
		return jsonify({'msg': 'Group name already exists'}), 409

@app.route("/api/v1/addUserToGroup", methods=["POST"])
@jwt_required(optional=True)
def create_group_user():
	new_groupUser = request.get_json()

	new_groupUser["groupID"] = groups_collection.find_one({"name": new_groupUser["groupname"]})["_id"]  # this must change if groupname is not unique!!
	new_groupUser["userID"] = users_collection.find_one({"username": new_groupUser["username"]})["_id"]
	
	if not new_groupUser.get("role"):
		new_groupUser["role"] = "member"
	
	result = groupUsers_collection.find_one({"groupID": new_groupUser["groupID"], "userID": new_groupUser["userID"]})
	if not result and (new_groupUser["groupID"] or new_groupUser["userID"]): # if there isnt a groupUser with identical ID's, and ID's actually exist
		del new_groupUser["groupname"], new_groupUser["username"]
		groupUsers_collection.insert_one(new_groupUser)

		groups_collection.update_one(
			{"_id": new_groupUser["groupID"]},
			{"$inc": {"numOfMembers": 1}}
		)

		return jsonify({'msg': 'User was successfully added to the Group'}), 200
	else: 
		return jsonify({'msg': 'Error while adding user to group. User was not added.'}), 409

@app.route("/api/v1/getGroups", methods=["GET"])
def get_groups():
	groups = list(groups_collection.find())
	if groups:
		for group in groups:
			group["creator"] = users_collection.find_one({"_id": group["userID"]})["username"]
			del group["_id"], group["userID"]
		return jsonify(groups), 200
	return jsonify({'msg': 'No groups exist.'}), 409

@app.route("/api/v1/getGroup", methods=["GET"])
def get_group():
	name = request.args.get("name")
	group = groups_collection.find_one({"name": name})
	if group:
		group["creator"] = users_collection.find_one({"_id": group["userID"]})["username"]
		del group["_id"], group["userID"]
		return jsonify(group), 200
	return jsonify({'msg': 'This group does not exist. Group name could not be found.'}), 409

@app.route("/api/v1/searchGroups", methods=["GET"])
def search_groups():
	search = request.args.get("search")
	groups = list(groups_collection.find())
	output = []
	if groups and search:
		for group in groups:
			if search in group["name"]: 
				group["creator"] = users_collection.find_one({"_id": group["userID"]})["username"]
				del group["_id"], group["userID"]
				output.append(group)
			elif search in group["description"]: 
				group["creator"] = users_collection.find_one({"_id": group["userID"]})["username"]
				del group["_id"], group["userID"]
				output.append(group)
		return jsonify(output), 200
	return jsonify({'msg': 'No groups exist.'}), 409

@app.route("/api/v1/getGroupByUser", methods=["GET"])
def get_users_groups(): # This feels like a very unsafe function...
	userID = request.args.get("userID") # must include either "userID" or "username"
	if not userID:
		username = request.args.get("username")
		print(username)
		userID = users_collection.find_one({"username": username})["_id"]

	output = []
	groupUsers = groupUsers_collection.find({"userID": userID})

	# groups = list(groups_collection.find({"_id": {"$in": [groupUser["groupID"] for groupUser in groupUsers]}})) cant use this cos i hvae to iterate and convert objects to strings anyway
	for groupUser in groupUsers:
		group = groups_collection.find_one({"_id": groupUser["groupID"]})
		group["creator"] = users_collection.find_one({"_id": group["userID"]})["username"]
		del group["_id"], group["userID"]
		output.append(group)
	if output: 
		return jsonify(output), 200
	return jsonify({'msg': 'No groups exist.'}), 409
	# for groupID in groupIDs:

@app.route("/api/v1/isUserInGroup")
def is_user_in_group():
	userID = request.args.get("userID") # must include either "userID" or "username"
	groupID = request.args.get("groupID")
	if not userID:
		username = request.args.get("username")
		userID = users_collection.find_one({"username": username})["_id"]

	if not groupID:
		groupname = request.args.get("groupname")
		groupID = groups_collection.find_one({"name": groupname})["_id"]

	groupUsers = groupUsers_collection.find_one({"userID": userID, "groupID": groupID})
	if groupUsers: 
		return jsonify({"joined": True}), 200
	return jsonify({'joined': False}), 200

	# groups = list(groups_collection.find({"_id": {"$in": [groupUser["groupID"] for groupUser in groupUsers]}})) cant use this cos i hvae to iterate and convert objects to strings anyway
	# for groupUser in groupUsers:
	# 	group = groups_collection.find_one({"_id": groupUser["groupID"]})
	# 	group["creator"] = users_collection.find_one({"_id": group["userID"]})["username"]
	# 	del group["_id"], group["userID"]
	# 	output.append(group)
	# if output: 
	# 	return jsonify(output), 200
	# return jsonify({'msg': 'No groups exist.'}), 409



##### Group messages
## WebSockets
@socketio.on("connect")
def connect():
	print("client connected")


@socketio.on("join")
def join_socket(data):
	username = data["username"]
	room = data["group"]
	join_room(room)
	send(username + " has joined room " + room, to=room)
	print(username + " joined " + room)

@socketio.on("recieve")
def send_message(data):
	print(data)
	send({"message": data["message"], "username": data["username"]}, to=data["group"])



##  Normal API calls for group messages
@app.route("/api/v1/getGroupMessages", methods=["GET"])
def get_groupMessage():
	pass


@app.route("/api/v1/sendGroupMessage", methods=["POST"])
def send_groupMessage():
	pass

#-----------------EVENTS SECTION------------
@app.route("/api/v1/createEvent", methods=["POST"])
@jwt_required()
def create_event():
	username = get_jwt_identity()
	if not username:
		return jsonify({'msg': 'You are not a valid user'}), 401
	new_event = request.get_json()
	highest_id = events_collection.find_one({"$query":{},"$orderby":{"id":-1}})
	id = highest_id["id"] + 1 if highest_id else 1

	event = {
		"id" : "{}".format(id),
		"owner" : username,
		"name" : new_event["name"],
		"location" : new_event["location"],
		"date" : new_event["date"],
		"participants" : [],
		"description" : new_event["description"],
		"private" : new_event["private"]
	}

	events_collection.insert_one(event)
	return jsonify({'msg': 'Event created.'}), 200
	
@app.route("/api/v1/getEvents", methods=["get"])
def get_events():
	data = events_collection.find({}, { "_id": 0 })
	if data:
		return jsonify(dumps(data)), 200
	return jsonify({'msg' : 'There are no events!'})
	
@app.route("/api/v1/getEvent", methods=["POST"])
def get_event():
	event = request.get_json()
	data = events_collection.find_one({'id' : str(event['id'])}, { "_id": 0 })
	if data:
		return jsonify(dumps(data)), 200
	return jsonify({'msg' : 'Event not found'}), 404

@app.route("/api/v1/addPersonToEvent", methods=["POST"])
def add_personToEvent():
	data = request.get_json()
	participants = events_collection.find_one({'id' : str(data['id'])}, { "_id": 0 })['participants']
	if data['username'] in participants:
		return jsonify({'msg' : 'User already in event'}), 401
	else:
		participants.append(data['username'])
	if data:
		events_collection.update_one({'id' : data['id']} , { '$set': {'participants' : participants}})
		return jsonify({'msg' : 'User added to event'}), 200
	return jsonify({'msg' : 'Event not found'}), 404

@app.route("/api/v1/removePersonFromEvent", methods=["POST"])
def removePersonFromEvent():
	data = request.get_json()
	print(data)
	participants = events_collection.find_one({'id' : str(data['id'])}, { "_id": 0 })['participants']
	if data['username'] in participants:
		participants.remove(data['username'])
	else:
		return jsonify({'msg' : 'User not in event'}), 401
	if data:
		events_collection.update_one({'id' : data['id']} , { '$set': {'participants' : participants}})
		return jsonify({'msg' : 'User removed from event'}), 200
	return jsonify({'msg' : 'Event not found'}), 404

if __name__ == '__main__':
	# app.run(debug=True)
	socketio.run(app, debug=True)