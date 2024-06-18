import json
import random
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker()

# create 50 fake users
users = [fake.user_name() for _ in range(50)]

# Function to generate a random timestamp within the last year
def random_timestamp():
    end = datetime.now()
    start = end - timedelta(days=365)
    return fake.date_time_between(start_date=start, end_date=end)

# Function to generate a like
def generate_like():
    return {
        "username": users[random.randint(0, len(users) - 1)],
        "timestamp": random_timestamp().isoformat()
    }

# Function to generate a comment
def generate_comment():
    return {
        "username": users[random.randint(0, len(users) - 1)],
        "content": fake.sentence(),
        "timestamp": random_timestamp().isoformat()
    }

# Function to generate a post
def generate_post():
    return {
        "username": users[random.randint(0, len(users) - 1)],
        "content": fake.sentence(),
        "timestamp": random_timestamp().isoformat(),
        "likes": [generate_like() for _ in range(random.randint(0, 5))],
        "comments": [generate_comment() for _ in range(random.randint(0, 4))]
    }

# Generate 250 posts
posts = [generate_post() for _ in range(250)]

# Write to a JSON file
with open('dummy_data.json', 'w') as f:
    json.dump(posts, f, indent=4)

print("Dummy data generated and saved to dummy_data.json")
