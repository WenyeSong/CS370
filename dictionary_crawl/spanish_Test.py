import requests
from bs4 import BeautifulSoup
import io
import sys
import json
from random import random
from time import sleep
from concurrent.futures import ThreadPoolExecutor

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/dutch-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     # Adjust the selector below to match the actual HTML structure of the dictionary page
#     page_word = soup.select_one("h2.tw-bw.dhw.dpos-h_hw.di-title")
#     if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
#         return None 

#     real_word = soup.select("div.def-body.ddef_b.ddef_b-t")
#     if real_word:
#         real_word = translation.get_text(strip=True)

#     translation = soup.select_one("span.dtrans")
#     if translation:
#         translation = translation.get_text(strip=True)

#     explanation = soup.select_one("div.def-body.ddef_b.def_b-t")
#     if explanation:
#         explanation = explanation.get_text(strip=True)

#     cn_examples = soup.select("span.dtrans-eg-transzh.lmr-10.hdb")
#     cn_example_texts = [cn_example.get_text(strip=True) for cn_example in cn_examples]

#     en_examples = soup.select("span.dtrans-egzh.lmr-10.hdb")
#     en_example_texts = [en_example.get_text(strip=True) for en_example in en_examples]

#     data = {
#         "word": word,
#         "real_word": real_word,
#         "translation": translation,
#         "explanations": explanation,
#         "cn_examples": cn_example_texts,
#         "en_examples": en_example_texts,
#         "chosen_cn_example": None,
#         "chosen_en_example": None
#     }

#     for cn_example, en_example in zip(cn_example_texts, en_example_texts):
#         if word in cn_example:
#             data["chosen_cn_example"] = cn_example
#             data["chosen_en_example"] = en_example
#             break
    
#     return data
def get_word_data(word):
    url = f"https://dictionary.cambridge.org/us/dictionary/spanish-english/{word}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    page_word = soup.select_one("h2.tw-bw.dhw.dpos-h_hw.di-title")
    if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
        return None 

    # Assuming you're trying to get a definition or similar as 'real_word'
    real_word_elements = soup.select("div.def-body.ddef_b.ddef_b-t")
    real_word_texts = [element.get_text(strip=True) for element in real_word_elements]

    translation = soup.select_one("span.dtrans")
    if translation:
        translation = translation.get_text(strip=True)

    explanation = soup.select_one("div.def-body.ddef_b.def_b-t")
    if explanation:
        explanation = explanation.get_text(strip=True)

    cn_examples = soup.select("span.dtrans-eg-transzh.lmr-10.hdb")
    cn_example_texts = [cn_example.get_text(strip=True) for cn_example in cn_examples]

    en_examples = soup.select("span.dtrans-egzh.lmr-10.hdb")
    en_example_texts = [en_example.get_text(strip=True) for en_example in en_examples]

    data = {
        "word": word,
        "real_word": real_word_texts,  # Now 'real_word' contains a list of texts
        "translation": translation,
        "explanations": explanation,
        "cn_examples": cn_example_texts,
        "en_examples": en_example_texts,
        "chosen_cn_example": None,
        "chosen_en_example": None
    }

    for cn_example, en_example in zip(cn_example_texts, en_example_texts):
        if word in cn_example:
            data["chosen_cn_example"] = cn_example
            data["chosen_en_example"] = en_example
            break
    
    return data


def crawl_words(words):
    results = []
    error = 0
    print("Initializing thread pool...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        for i, word in enumerate(words[:10], start=1):
            word = word.split()[0]
            print(f"Submitting task {i}/{len(words)}")
            futures.append(executor.submit(get_word_data, word))
            sleep(random() + 0.5)

        print("All tasks submitted. Waiting for results...")
        for i, future in enumerate(futures, start=1):
            try:
                data = future.result()
            except Exception:
                data = {
                    "word": words[i - 1],
                    "real_word": None,
                    "translation": "error",
                    "explanations": [],
                    "cn_examples": [],
                    "en_examples": [],
                    "chosen_cn_example": None,
                    "chosen_en_example": None,
                }
                error += 1
            print(f'{i}/{len(words)}')
            results.append(data)

    print("Crawling finished")
    print(f"Error: {error}")
    return results

if __name__ == "__main__":
    with open("d:\\CS370\\dictionary_crawl\\spanish\\spanish_words.txt", "r", encoding="utf-8") as f:
        words = f.read().splitlines()
    results = crawl_words(words)
    with open("d:\\CS370\\dictionary_crawl\\spanish\\spanish_dict.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)