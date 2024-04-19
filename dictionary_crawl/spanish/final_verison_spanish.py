# import json
# def modify_json(data):
#     for entry in data:
#         new_real_word = []
#         explanations = []
#         language_id = []
#         language_id.append(3)
#         entry['language_id'] = 3
#         for item in entry['real_word']:
#             split_index = item.find('[')
#             real_word_part = item[:split_index]
#             explanation_part = item[split_index:]
#             new_real_word.append(real_word_part.strip())
#             explanations.append(explanation_part.strip())
            
#         entry['real_word'] = new_real_word
#         entry['explanation'] = explanations
        
#     return data

# # Read JSON data from a file
# def read_json(filename):
#     with open(filename, 'r') as file:
#         return json.load(file)

# # Write modified data to a new JSON file
# def write_json(data, filename):
#     with open(filename, 'w') as file:
#         json.dump(data, file, ensure_ascii=False, indent=4)

# # Main program
# input_filename = 'd:\\CS370\\dictionary_crawl\\spanish\\spanish_dict1.json'  # The file from which to read the JSON data
# output_filename = 'd:\\CS370\\dictionary_crawl\\spanish\\final_spanish.json'  # The file to save the modified JSON data

# # Read the original data
# original_data = read_json('d:\\CS370\\dictionary_crawl\\spanish\\spanish_dict1.json')

# # Process the data
# modified_data = modify_json(original_data)

# # Write the modified data back to a new file
# write_json(modified_data, output_filename)

# print("Modified data has been saved to 'final_spanish.json'")
import json
import os

def modify_json(data):
    for entry in data:
        new_real_word = []
        explanations = []
        entry['language_id'] = 3  # Directly set language ID for each entry
        for item in entry['real_word']:
            split_index = item.find('[')
            if split_index != -1:  # Ensure that there is a bracket to split on
                real_word_part = item[:split_index].strip()
                explanation_part = item[split_index:].strip()
                new_real_word.append(real_word_part)
                explanations.append(explanation_part)
            else:
                new_real_word.append(item.strip())  # Add the item as is if no brackets are found
                explanations.append("No explanation provided")  # Handle missing explanations


        entry['real_word'] = new_real_word
        entry['explanation'] = explanations
        
    return data

def read_json(filename):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    else:
        raise FileNotFoundError(f"No such file: {filename}")

def write_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    input_filename = 'd:\\CS370\\dictionary_crawl\\spanish\\spanish_dict1.json'
    output_filename = 'd:\\CS370\\dictionary_crawl\\spanish\\final_spanish1.json'

    try:
        original_data = read_json(input_filename)
        modified_data = modify_json(original_data)
        write_json(modified_data, output_filename)
        print(f"Modified data has been saved to '{output_filename}'")
    except FileNotFoundError as e:
        print(e)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

