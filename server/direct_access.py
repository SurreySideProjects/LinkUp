import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
MONGO_URL = os.getenv('MONGO_URL')

client = MongoClient(MONGO_URL)
db = client["PartyVerse"]
users_collection = db["users"]

#x = users_collection.delete_many({})

query = { "username": "testuser" }
new_value = { "$set" : { "verified" : True}}
x = users_collection.update_one(query, new_value)