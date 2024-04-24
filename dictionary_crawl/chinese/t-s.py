
# pip install opencc-python-reimplemented

from opencc import OpenCC
import json
def convert_to_simplified(traditional_text):
    cc = OpenCC('t2s')  # t2s: Traditional Chinese to Simplified Chinese
    return cc.convert(traditional_text)

def convert_txt_to_json(input_txt_file, output_json_file):
    words_list = []
    with open(input_txt_file, 'r', encoding='utf-8') as file:
        for line in file:
            rank, word, frequency = line.strip().split('\t')
            simplified_word = convert_to_simplified(word)
            words_list.append({'rank': int(rank), 'word': simplified_word, 'frequency': int(frequency)})
    
    with open(output_json_file, 'w', encoding='utf-8') as json_file:
        json.dump(words_list, json_file, ensure_ascii=False, indent=4)


input_txt_file = 'd:\\CS370\\dictionary_crawl\\chinese\\test.txt'
output_json_file = 'simplified23_.json'

convert_txt_to_json(input_txt_file, output_json_file)
