import pandas as pd

file_path = 'd:\\CS370\\dictionary_crawl\\french\\fra_news_2023_100K-words.txt'

df = pd.read_csv(file_path, sep="\t", header=None, names=["Number", "Word", "Frequency"])

def is_french_word(word):
    
    for char in word:
        if not ((char.isalpha() and char in " AZERTYUIOPQSDFGHJKLWXCVBNMabcdefghijklmnopqrstuvwxyzàâäçéèêëîïôöùûüÿœæ") or char == "-"):
            return False
    return True


filtered_df = df.drop(columns=['Number', 'Frequency']).apply(lambda x: x.astype(str).str.lower()).drop_duplicates()

filtered_df = filtered_df[filtered_df["Word"].apply(is_french_word)]

filtered_df.to_csv("d:\\CS370\\dictionary_crawl\\french\\filtered_f11.txt", sep="\t", index=False, header=False)

print("Filtered data saved to 'filtered_f11.txt'.")

