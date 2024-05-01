import json

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)


def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


def transform_data(entries):
    result = {}
    for entry in entries:
        word = entry['word']
        real_words = list(set(entry['english_term']))  
        result[word] = real_words
    return result

if __name__ == "__main__":
    input_filename = 'd:\\CS370\\dictionary_crawl\\german\\final_german1.json'
    output_filename = 'd:\\CS370\\dictionary_crawl\\combine\\german-english.json'
    

    original_data = load_json(input_filename)

    transformed_data = transform_data(original_data)

    save_json(transformed_data, output_filename)
    
    print(f"Transformed data saved to '{output_filename}'.")
