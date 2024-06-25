#!/bin/bash

# Wait for MongoDB to start
sleep 10

# Import data into the 'socialAPI' database
mongoimport --host localhost --db socialAPI --collection posts --file /docker-entrypoint-initdb.d/socialAPI.posts.json --jsonArray