import json
import os

def modify_json(data):
    for entry in data:
        new_real_word = []
        explanations = []
        entry['language_id'] = 5
        for item in entry['real_word']:
            split_index = item.find('[')
            if split_index != -1:  
                real_word_part = item[:split_index].strip()
                explanation_part = item[split_index:].strip()
                new_real_word.append(real_word_part)
                explanations.append(explanation_part)
            else:
                new_real_word.append(item.strip())  
                explanations.append("No explanation provided") 


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
    input_filename = 'd:\\CS370\\dictionary_crawl\\german\\german_dict1.json'
    output_filename = 'd:\\CS370\\dictionary_crawl\\german\\final_german1.json'

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