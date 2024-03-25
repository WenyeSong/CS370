import requests
from bs4 import BeautifulSoup
import io
import sys
import json
from random import random
from time import sleep
from concurrent.futures import ThreadPoolExecutor

# sys.stdout = io.TextIOWrapper(buffer=sys.stdout.buffer,encoding='utf8')

def get_word_data(word):
    url = f"https://dictionary.cambridge.org/us/dictionary/chinese-simplified-english/{word}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    translation = soup.select_one("span.dtrans")
    if translation:
        translation = translation.get_text(strip=True)
    explanation = soup.select_one("div.def")
    if explanation:
        explanation = explanation.get_text(strip=True)
    cn_example = soup.select_one("span.dtrans-eg-transzh.lmr-10.hdb")
    if cn_example:
        cn_example = cn_example.get_text(strip=True)
    en_example = soup.select_one("span.dtrans-egzh.lmr-10.hdb")
    if en_example:
        en_example = en_example.get_text(strip=True)
    return {
        "word": word,
        "translation": translation,
        "explanation": explanation,
        "cn_example": cn_example,
        "en_example": en_example,
    }

def crawl_words(words):
    results = []
    error = 0
    print("Initializing thread pool...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        for i, word in enumerate(words[:4], start=1):
            word = word.split()[0]
            print(f"Submitting task {i}/{len(words[:100])}")
            futures.append(executor.submit(get_word_data, word))
            sleep(random() + 1)
        print("All tasks submitted. Waiting for results...")
        for i, future in enumerate(futures, start=1):
            try:
                data = future.result()
            except Exception:
                data = {
                    "word": words[i - 1],
                    "translation": "error",
                    "explanation": "error",
                    "cn_example": "error",
                    "en_example": "error",
                }
                error += 1
            print(f'{i}/{len(words[:1000])}')
            results.append(data)
    print("Crawling finished")
    print(f"Error: {error}")
    return results

if __name__ == "__main__":
    with open("./chinese_list.txt", "r", encoding="utf-8") as f:
        words = f.read().splitlines()
    results = crawl_words(words)
    with open("chinese_dict2.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)