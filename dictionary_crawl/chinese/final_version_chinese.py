import json

input_file_path = 'd:\\CS370\\dictionary_crawl\\chinese\\chinese_dict.json'
output_file_path = 'd:\\CS370\\dictionary_crawl\\chinese\\final_chinese.json'


with open(input_file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)
for entry in data:
    if 'english_term' in entry and not isinstance(entry['english_term'], list):
        entry['english_term'] = [entry['english_term']]
    if 'explanation' in entry and not isinstance(entry['explanation'], list):
        entry['explanation'] = [entry['explanation']]

# Write the modified data back to a new JSON file
with open(output_file_path, 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print(f"Modified JSON data has been saved to '{output_file_path}'.")
