
import json

def remove_duplicates(txt_word_list, json_word_list):
    """Remove duplicate words from the text word list based on the JSON word list."""

    json_words = set(entry["word"] for entry in json_word_list)
    
    unique_words = [word for word in txt_word_list if word.lower() not in json_words]
    
    return unique_words

if __name__ == "__main__":

    json_file_path = "d:\\CS370\\dictionary_crawl\\french\\french_dict1.json"

    txt_file_path = "d:\\CS370\\dictionary_crawl\\french\\filtered_f11.txt"
    

    with open(json_file_path, 'r', encoding='utf-8') as file:
        json_word_list = json.load(file)

    with open(txt_file_path, 'r', encoding='utf-8') as file:
        txt_word_list = [word.strip() for word in file]

    unique_word_list = remove_duplicates(txt_word_list, json_word_list)
    with open(txt_file_path, 'w', encoding='utf-8') as file:
        file.write("\n".join(unique_word_list))
    
    print("Duplicate words removed from the word list.")
