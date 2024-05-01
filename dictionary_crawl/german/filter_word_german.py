import pandas as pd

file_path = 'd:\\CS370\\dictionary_crawl\\german\\deu-de_web-public_2019_10K-words.txt'

df = pd.read_csv(file_path, sep="\t", header=None, names=["Number", "Word", "Frequency"])

def is_german_word(word):
    if not isinstance(word, str):
        return False
    
    allowed_chars = set("abcdefghijklmnopqrstuvwxyzäöüßABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ-")
    return all(char in allowed_chars for char in word)

filtered_df = df[df["Word"].apply(is_german_word)].drop(columns=['Number'])

output_path = "d:\\CS370\\dictionary_crawl\\german\\filtered_german_words.txt"
filtered_df.to_csv(output_path, sep="\t", index=False, header=False)

print(f"Filtered data saved to '{output_path}'.")

