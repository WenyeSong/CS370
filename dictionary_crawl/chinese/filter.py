import pandas as pd

file_path = "d:\\CS370\\dictionary_crawl\\chinese\\zho-simp-tw_web_2014_10K-words.txt"

try:
    df = pd.read_csv(file_path, sep="\t", header=None, names=["Number", "Word", "Frequency"], quotechar='"', escapechar='\\')
    def check_contain_chinese(check_str):
        for ch in check_str:
            if len(check_str)!=2:
                return False    

            if u'\u4e00' <= ch <= u'\u9fff':
                return True
        return False

    filtered_df = df[df["Word"].apply(check_contain_chinese)].drop(columns=['Number'])

    output_path = "d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt"
    filtered_df.to_csv(output_path, sep="\t", index=False, header=False)
    print("Filtered data saved to 'filtered_words_chinese.txt'.")

except pd.errors.ParserError as e:
    print("Parsing error:", e)
except Exception as e:
    print("An error occurred:", e)
