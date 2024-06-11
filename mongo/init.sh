#!/bin/bash

# Wait for MongoDB to start
sleep 10

# Import data into the 'socialAPI' database
mongoimport --host mongo --db socialAPI --collection posts --file /docker-entrypoint-initdb.d/socialAPI.posts.json --jsonArray
mongoimport --host mongo --db socialAPI --collection users --file /docker-entrypoint-initdb.d/socialAPI.users.json --jsonArray
