
import json

def remove_duplicates(txt_word_list, json_word_list):
    """Remove duplicate words from the text word list based on the JSON word list."""
    # Extract words from the JSON word list
    json_words = set(entry["word"] for entry in json_word_list)
    
    # Remove duplicates from the text word list
    unique_words = [word for word in txt_word_list if word.lower() not in json_words]
    
    return unique_words

if __name__ == "__main__":
    # Path to your JSON word list file
    json_file_path = "d:\\CS370\\dictionary_crawl\\french\\french_dict1.json"
    # Path to your txt word list file
    txt_file_path = "d:\\CS370\\dictionary_crawl\\french\\filtered_f11.txt"
    
    # Load the JSON data
    with open(json_file_path, 'r', encoding='utf-8') as file:
        json_word_list = json.load(file)
    
    # Read the word list from the txt file
    with open(txt_file_path, 'r', encoding='utf-8') as file:
        txt_word_list = [word.strip() for word in file]
    
    # Remove duplicate words from the txt word list
    unique_word_list = remove_duplicates(txt_word_list, json_word_list)
    
    # Save the unique word list back to the txt file
    with open(txt_file_path, 'w', encoding='utf-8') as file:
        file.write("\n".join(unique_word_list))
    
    print("Duplicate words removed from the word list.")
