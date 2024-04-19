import json
def modify_json(data):
    for entry in data:
        new_real_word = []
        explanations = []
        language_id = []
        language_id.append(1)
        entry['language_id'] = 1
        for item in entry['real_word']:
            split_index = item.find('[')
            real_word_part = item[:split_index]
            explanation_part = item[split_index:]
            new_real_word.append(real_word_part.strip())
            explanations.append(explanation_part.strip())
            
        entry['real_word'] = new_real_word
        entry['explanation'] = explanations
        
    return data

# Read JSON data from a file
def read_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

# Write modified data to a new JSON file
def write_json(data, filename):
    with open(filename, 'w') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Main program
input_filename = 'd:\\CS370\\dictionary_crawl\\dutch\\dutch_dict1.json'  # The file from which to read the JSON data
output_filename = 'd:\\CS370\\dictionary_crawl\\dutch\\final_dutch.json'  # The file to save the modified JSON data

# Read the original data
original_data = read_json('d:\\CS370\\dictionary_crawl\\dutch\\dutch_dict1.json')

# Process the data
modified_data = modify_json(original_data)

# Write the modified data back to a new file
write_json(modified_data, output_filename)

print("Modified data has been saved to 'modified_data.json'")
