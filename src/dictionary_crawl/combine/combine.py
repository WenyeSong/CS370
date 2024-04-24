import json

# Load JSON data from a file
def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

# Save data to a JSON file
def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Transform the data from the current format to the desired format
def transform_data(entries):
    result = {}
    for entry in entries:
        word = entry['word']
        real_words = list(set(entry['english_term']))  # Use set to remove duplicates
        result[word] = real_words
    return result

# Example usage
if __name__ == "__main__":
    input_filename = 'd:\\CS370\\dictionary_crawl\\french\\final_french.json'
    output_filename = 'd:\\CS370\\dictionary_crawl\\combine\\french-english.json'
    
    # Load data from input file
    original_data = load_json(input_filename)
    
    # Transform the data
    transformed_data = transform_data(original_data)
    
    # Save the transformed data to a new file
    save_json(transformed_data, output_filename)
    
    print(f"Transformed data saved to '{output_filename}'.")
