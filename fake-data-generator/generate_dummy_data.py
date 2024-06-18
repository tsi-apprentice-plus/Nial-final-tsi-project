import json
import random
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker()

usernames = [fake.user_name() for _ in range(50)]

# Function to generate a random timestamp within the last year
def random_timestamp():
    end = datetime.utcnow()
    start = end - timedelta(days=365)
    return fake.date_time_between(start_date=start, end_date=end)

# Function to convert datetime to MongoDB date format
def mongo_date(dt):
    return {"$date": dt.isoformat()}

# Function to generate a like
def generate_like():
    return {
        "username": usernames[random.randint(0, 49)],
        "timestamp": mongo_date(random_timestamp())
    }

# Function to generate a comment
def generate_comment():
    return {
        "username": usernames[random.randint(0, 49)],
        "content": fake.sentence(),
        "timestamp": mongo_date(random_timestamp())
    }

# Function to generate a post
def generate_post():
    return {
        "username": usernames[random.randint(0, 49)],
        "content": fake.sentence(),
        "timestamp": mongo_date(random_timestamp()),
        "likes": [generate_like() for _ in range(random.randint(0, 5))],
        "comments": [generate_comment() for _ in range(random.randint(0, 4))]
    }

# Generate 250 posts
posts = [generate_post() for _ in range(250)]

# Write to a JSON file
with open('dummy_data.json', 'w') as f:
    json.dump(posts, f, indent=4)

print("Dummy data generated and saved")
