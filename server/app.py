import hashlib
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URL = os.getenv('MONGO_URL')
SECRET_KEY = os.getenv('JWT_KEY')

app = Flask(__name__)
CORS(app, supports_credentials=True, origins='*', headers=['Content-Type', 'Authorization'], expose_headers='Authorization')
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=7) #Token expires in 7 days

#Connection
client = MongoClient(MONGO_URL)
db = client["PartyVerse"]
users_collection = db["users"]
groups_collection = db["groups"]
groupUsers_collection = db["groupUsers"]

@app.route("/api/v1/users", methods=["POST"])
def register():
	new_user = request.get_json() # store the json body request
	new_user["password"] = hashlib.sha256(new_user["password"].encode("utf-8")).hexdigest() # encrpt password
	doc = users_collection.find_one({"username": new_user["username"]}) # check if user exist
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


@app.route("/api/v1/createGroup", methods=["POST"]) # for now, gorups have primary key of name, but will change later
@jwt_required()
def createGroup():
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
		return jsonify({'msg': 'Group was created successfully'}), 201
	else:
		return jsonify({'msg': 'Group name already exists'}), 409

@app.route("/api/v1/addUserToGroup", methods=["POST"])
@jwt_required(optional=True)
def createGroupUser():
	new_groupUser = request.get_json()

	new_groupUser["groupID"] = groups_collection.find_one({"name": new_groupUser["groupname"]})["_id"]  # this must change if groupname is not unique!!
	new_groupUser["userID"] = users_collection.find_one({"username": new_groupUser["username"]})["_id"]
	
	if not new_groupUser.get("role"):
		new_groupUser["role"] = "member"
	
	result = groupUsers_collection.find_one({"groupID": new_groupUser["groupID"], "userID": new_groupUser["userID"]})
	print(not result)
	if not result and (new_groupUser["groupID"] or new_groupUser["userID"]): # if there isnt a groupUser with identical ID's, and ID's actually exist
		del new_groupUser["groupname"], new_groupUser["username"]
		groupUsers_collection.insert_one(new_groupUser)

		groups_collection.update_one(
			{"_id": new_groupUser["groupID"]},
			{"$inc": {"numOfMembers": 1}}
		)

		return jsonify({'msg': 'User was successfully added to the Group'}), 201
	else: 
		return jsonify({'msg': 'Error while adding user to group. User was not added.'}), 409

@app.route("/api/v1/getGroups", methods=["get"])
def get_groups():
	groups = list(groups_collection.find())
	if groups:
		for group in groups:
			group["creator"] = users_collection.find_one({"_id": group["userID"]})["username"]
			del group["_id"], group["userID"]
		return jsonify(groups), 200
	return jsonify({'msg': 'No groups exist.'}), 409



if __name__ == '__main__':
	app.run(debug=True)