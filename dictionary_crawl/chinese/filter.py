import json

def filter_null(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        word_list = json.load(file)

    # Filter the word list
    filtered_list = [word for word in word_list if word["translation"] is not None]
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(filtered_list, file, ensure_ascii=False, indent=4)

input_file = 'd:\\CS370\\dictionary_crawl\\chinese\\chinese_dict.json'
output_file = 'filtered_chinese_dict.json' 
filter_null(input_file, output_file)