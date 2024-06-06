import json

def merge_json_files(file1_path, file2_path, output_path, merge_key):
    # Read data from the first JSON file
    with open(file1_path, 'r') as file1:
        data1 = json.load(file1)

    # Read data from the second JSON file
    with open(file2_path, 'r') as file2:
        data2 = json.load(file2)

    # Create a dictionary to store data based on the merge key
    merged_data = {}

    # Merge data from the first file based on the merge key
    for item1 in data1:
        key_value = item1.get("id")
        merged_data[key_value] = item1

    # Update the merged data with information from the second file
    for item2 in data2:
        key_value = item2.get(merge_key)
        if key_value in merged_data:
            # Check if 'comments' key already exists, if not, create it
            if 'likes' not in merged_data[key_value]:
                merged_data[key_value]['likes'] = []
            merged_data[key_value]['likes'].append(item2)

    # Write the merged data to the output JSON file
    with open(output_path, 'w') as output_file:
        json.dump(list(merged_data.values()), output_file, indent=2)

# Example usage
file1_path = 'posts.json'
file2_path = 'likes2.json'
output_path = 'merged_output2.json'
merge_key = 'postID'

merge_json_files(file1_path, file2_path, output_path, merge_key)
