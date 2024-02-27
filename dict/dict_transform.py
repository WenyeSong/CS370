import json

def txt_to_json(txt_file, json_file):
    data_dict = {} 
    with open(txt_file, 'r', encoding='utf-8') as file:
        for line in file:
            # Remove the newline character and split the line by tabs
            parts = line.strip().rsplit('\t', 1)[0].split('\t')
            
            if len(parts) == 2:
                word, english_translations = parts
                # Split the English translations by "  ; " and strip whitespace
                data_dict[word] = [t.strip() for t in english_translations.split(';')]
    json_str = json.dumps(data_dict, indent=4, ensure_ascii=False)

    with open(json_file, 'w', encoding='utf-8') as file:
        file.write(json_str)
    
    return data_dict

txt_file_path = 'dict/chinese-english-2024-02-27.txt'
json_file_path = 'chinese-english.json'

data_dict = txt_to_json(txt_file_path, json_file_path)

print(f"Data has been successfully converted and written to {json_file_path}.")
