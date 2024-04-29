from hanziconv import HanziConv

# # def convert_to_simplified(traditional_text):
# #     return HanziConv.toSimplified(traditional_text)

# def convert_txt_to_json(input_txt_file, output_json_file):
#     words_list = []
#     with open(input_txt_file, 'r', encoding='utf-8') as file:
#         for line in file:
#             # Splitting the line into two parts: "rank word" and "frequency"
#             part1, frequency = line.strip().split('\t')
#             # Now split part1 by the last space to separate rank and word
#             rank, word = part1.rsplit(' ', 1)
#             # simplified_word = convert_to_simplified(word)
#             words_list.append({'rank': int(rank), 'word': word, 'frequency': int(frequency)})
    
#     if words_list:  # Check if the list is not empty
#         with open(output_json_file, 'w', encoding='utf-8') as json_file:
#             json.dump(words_list, json_file, ensure_ascii=False, indent=4)
#     else:
#         print("Warning: The words list is empty. No data will be written to the JSON file.")

# input_txt_file = 'd:\\CS370\\dictionary_crawl\\chinese\\test.txt'
# output_json_file = 'd:\\CS370\\dictionary_crawl\\chinese\\simplified_.json'

# convert_txt_to_json(input_txt_file, output_json_file)

# Since there's no need for conversion this time, the code simply reads the text file, 
# parses each line, and then writes the output to a JSON file.

# def txt_to_json(input_txt_file, output_json_file):
#     words_list = []
#     with open(input_txt_file, 'r', encoding='utf-8') as file:
#         for line in file:
#             rank, word, frequency = line.strip().split('\t')
#             words_list.append({'rank': int(rank), 'word': word, 'frequency': int(frequency)})
    
#     with open(output_json_file, 'w', encoding='utf-8') as json_file:
#         json.dump(words_list, json_file, ensure_ascii=False, indent=4)

# # Example usage with a placeholder path
# input_txt_file = 'd:\\CS370\\dictionary_crawl\\chinese\\test.txt'  
# output_json_file = 'd:\\CS370\\dictionary_crawl\\chinese\\test1231231414515151515.json'  


# # txt_to_json(input_txt_file, output_json_file)




import re
import json
import pandas as pd

def parse_line(line):
    # Find all numeric components (assuming they represent rank and frequency)
    numbers = re.findall(r'\d+', line)
    if len(numbers) >= 2:
        rank = numbers[0]
        frequency = numbers[-1]
        # Remove the rank and frequency from the line to assume the remainder is the word
        word = re.sub(f"^{rank}|{frequency}$", "", line).strip()
        return rank, word, frequency
    return None, None, None

def txt_to_json(input_txt_file, output_json_file):
    words_list = []
    df = pd.read_csv(input_txt_file,sep=r'\t', names=['id', 'chr', 'count'])
    df = df.drop(columns=['id'])
    print(df)
    df.to_json(output_json_file)
    # with open(input_txt_file, 'r', encoding='utf-8') as file:
    #     for line in file:
    #         rank, word, frequency = parse_line(line)
    #         if rank and word and frequency:
    #             words_list.append({'rank': int(rank), 'word': word, 'frequency': int(frequency)})
    #         else:
    #             print(f"Skipping line due to unexpected format: {line.strip()}")
    
    # with open(output_json_file, 'w', encoding='utf-8') as json_file:
    #     json.dump(words_list, json_file, ensure_ascii=False, indent=4)



# txt_to_json(input_txt_file, output_json_file)

input_txt_file = 'd:\\CS370\\dictionary_crawl\\chinese\\zho_wikipedia_2018_10K-words.txt'  
output_json_file = 'd:\\CS370\\dictionary_crawl\\chinese\\test1231231414515151515.json'  


txt_to_json(input_txt_file, output_json_file)
