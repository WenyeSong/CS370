import pandas as pd


file_path = 'd:\\CS370\\dictionary_crawl\\dutch\\fra_wikipedia_2021_10K-words.txt'


df = pd.read_csv(file_path, sep="\t", header=None, names=["Number", "Word", "Frequency"])

def is_french_word(word):
    for char in word:
        if not ((char.isalpha() and char in "AZERTYUIOPQSDFGHJKLWXCVBNMabcdefghijklmnopqrstuvwxyzàâäçéèêëîïôöùûüÿœæ") or char == "-"):
            return False
    return True


filtered_df = df[df["Word"].apply(is_french_word)].drop(columns=['Number'])

filtered_df.to_csv("d:\\CS370\\dictionary_crawl\\french\\filtered_words1.txt", sep="\t", index=False, header=False)

print("Filtered data saved to 'filtered_words1.txt'.")