import json
import os

def load_json(file_path):
    """ Load JSON data from a file. """
    with open(file_path, 'r') as file:
        return json.load(file)

def save_json(data, file_path):
    """ Save data to a JSON file with indentation. """
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def reformat_data(data):
    """ Reformat the data to the new structure where each word maps to its real_word list. """
    return {entry['word']: entry['real_word'] for entry in data}

def split_data(data):
    """ Split data into three parts based on the 'word_number'. """
    sorted_data = sorted(data, key=lambda x: x['word_number'])
    n = len(sorted_data)
    part_size = n // 3
    return [
        sorted_data[:part_size],
        sorted_data[part_size:2*part_size],
        sorted_data[2*part_size:]
    ]

def main():
    # User input for the JSON file path
    input_file_path = input("Enter the path to the original JSON file: ")
    output_directory = input("Enter the path to the output directory: ")

    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)

    # Load the original data
    original_data = load_json(input_file_path)

    # Split the data first
    parts = split_data(original_data)
    split_files = []
    for i, part in enumerate(parts):
        part_file_path = os.path.join(output_directory, f'split_part_{i+1}.json')
        save_json(part, part_file_path)
        split_files.append(part_file_path)
        print(f"Part {i+1} saved to {part_file_path}")

    # Reformat each split file
    for i, split_file in enumerate(split_files):
        part_data = load_json(split_file)
        reformatted_data = reformat_data(part_data)
        reformatted_file_path = os.path.join(output_directory, f'reformatted_part_{i+1}.json')
        save_json(reformatted_data, reformatted_file_path)
        print(f"Reformatted part {i+1} saved to {reformatted_file_path}")

if __name__ == "__main__":
    main()
