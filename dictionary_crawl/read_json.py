# import json

# # Open the JSON file for reading
# with open('chinese_dict.json', 'r', encoding='utf-8') as file:
#     # Load the contents of the file into a Python object
#     data = json.load(file)

# # Print the data
# print(data)

import csv

# Open the CSV file for reading
with open('chinese_dict.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    data = list(reader)

# Print the data
for row in data:
    print(row)