# import requests
# from bs4 import BeautifulSoup
# import io
# import sys
# import json
# from random import random
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor

# # sys.stdout = io.TextIOWrapper(buffer=sys.stdout.buffer,encoding='utf8')

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/chinese-simplified-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")
#     translation = soup.select_one("span.dtrans")
#     if translation:
#         translation = translation.get_text(strip=True)
#     explanation = soup.select_one("div.def")
#     if explanation:
#         explanation = explanation.get_text(strip=True)
#     cn_example = soup.select_one("span.dtrans-eg-transzh.lmr-10.hdb")
#     if cn_example:
#         cn_example = cn_example.get_text(strip=True)
#     en_example = soup.select_one("span.dtrans-egzh.lmr-10.hdb")
#     if en_example:
#         en_example = en_example.get_text(strip=True)
#     return {
#         "word": word,
#         "translation": translation,
#         "explanation": explanation,
#         "cn_example": cn_example,
#         "en_example": en_example,
#     }

# def crawl_words(words):
#     results = []
#     error = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:4], start=1):
#             word = word.split()[0]
#             print(f"Submitting task {i}/{len(words[:100])}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(random() + 1)
#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#             except Exception:
#                 data = {
#                     "word": words[i - 1],
#                     "translation": "error",
#                     "explanation": "error",
#                     "cn_example": "error",
#                     "en_example": "error",
#                 }
#                 error += 1
#             print(f'{i}/{len(words[:1000])}')
#             results.append(data)
#     print("Crawling finished")
#     print(f"Error: {error}")
#     return results

# if __name__ == "__main__":
#     with open("chinese_list.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     with open("chinese_dict2.json", "w", encoding="utf-8") as f:
#         json.dump(results, f, ensure_ascii=False, indent=4)
import requests
from bs4 import BeautifulSoup
import json
from random import random
from time import sleep
from concurrent.futures import ThreadPoolExecutor

def get_word_data(word):
    url = f"https://dictionary.cambridge.org/us/dictionary/chinese-english/{word}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    page_word = soup.select_one("h2.tw-bw.dhw.dpos-h_hw.di-title")
    if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
        return None 

    real_word_elements = soup.select("div.def-body.ddef_b.ddef_b-t")
    real_word_texts = []
    for element in real_word_elements:
        sentences = element.get_text(strip=True).split(". ")
        filtered_sentences = [sentence for sentence in sentences if '[' in sentence]
        if filtered_sentences:
            real_word_texts.append(". ".join(filtered_sentences) + ".")

    if not real_word_texts:
        return None  # Do not return a dictionary if no sentences are suitable

    return {
        "word": word,
        "real_word": real_word_texts
    }

def crawl_words(words):
    results = []
    error = 0
    word_number = 0  # Initialize word count here, but don't increment yet
    print("Initializing thread pool...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        for i, word in enumerate(words[:6772], start=1):  # Example limit to first 8 words
            word = word.split()[0]  # Treat only the first part of any line as the word
            print(f"Submitting task {i}/{len(words)}")
            futures.append(executor.submit(get_word_data, word))
            sleep(random() + 0.2)

        print("All tasks submitted. Waiting for results...")
        for i, future in enumerate(futures, start=1):
            try:
                data = future.result()
                if data:  # Add to results only if data is not None
                    word_number += 1  # Increment here when adding to results
                    data['word_number'] = word_number  # Add word_number to data
                    results.append(data)
            except Exception as e:
                print(f"Error processing word '{words[i-1]}': {str(e)}")
                error += 1
            print(f'{i}/{len(words)}: Completed')

    print("Crawling finished")
    print(f"Error count: {error}")
    return results

if __name__ == "__main__":
    with open("d:\\CS370\\dictionary_crawl\\french\\filtered_words1.txt", "r", encoding="utf-8") as f:
        words = f.read().splitlines()
    results = crawl_words(words)
    if results:
        with open("d:\\CS370\\dictionary_crawl\\french\\french_dict1.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=4)
    else:
        print("No valid entries to save.")