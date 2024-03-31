import re
from hanziconv import HanziConv
import json

def convert_to_simplified(traditional_text):
    return HanziConv.toSimplified(traditional_text)

def convert_txt_to_json(input_txt_file, output_json_file):
    words_list = []
    with open(input_txt_file, 'r', encoding='utf-8') as file:
        for line in file:
            # Use a regular expression to match rank, word, and frequency
            match = re.match(r'(\d+)\s+(\S+)\s+(\d+)', line.strip())
            if match:
                rank, word, frequency = match.groups()
                simplified_word = convert_to_simplified(word)
                words_list.append({'rank': int(rank), 'word': simplified_word, 'frequency': int(frequency)})
            else:
                print(f"Skipping line due to unexpected format: {line.strip()}")

    if words_list:  # Check if the list is not empty
        with open(output_json_file, 'w', encoding='utf-8') as json_file:
            json.dump(words_list, json_file, ensure_ascii=False, indent=4)
    else:
        print("Warning: The words list is empty. No data will be written to the JSON file.")

input_txt_file = 'd:\\CS370\\dictionary_crawl\\chinese\\test.txt'
output_json_file = 'd:\\CS370\\dictionary_crawl\\chinese\\simplified_.json'

convert_txt_to_json(input_txt_file, output_json_file)
