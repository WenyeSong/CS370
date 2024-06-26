import requests
from bs4 import BeautifulSoup
import json
from random import random
from time import sleep
from concurrent.futures import ThreadPoolExecutor

def get_word_data(word):
    url = f"https://dictionary.cambridge.org/us/dictionary/spanish-english/{word}"
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
        return None  

    return {
        "word": word,
        "real_word": real_word_texts
    }

def crawl_words(words):
    results = []
    error = 0
    word_number = 0  
    print("Initializing thread pool...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        for i, word in enumerate(words[:7400], start=1):  
            word = word.split()[0]  
            print(f"Submitting task {i}/{len(words)}")
            futures.append(executor.submit(get_word_data, word))
            sleep(0.1)

        print("All tasks submitted. Waiting for results...")
        for i, future in enumerate(futures, start=1):
            try:
                data = future.result()
                if data:  
                    word_number += 1  
                    data['word_number'] = word_number  
                    results.append(data)
            except Exception as e:
                print(f"Error processing word '{words[i-1]}': {str(e)}")
                error += 1
            print(f'{i}/{len(words)}: Completed')

    print("Crawling finished")
    print(f"Error count: {error}")
    return results

if __name__ == "__main__":
    with open("d:\\CS370\\dictionary_crawl\\spanish\\filtered_spanish_words.txt", "r", encoding="utf-8") as f:
        words = f.read().splitlines()
    results = crawl_words(words)
    if results:
        with open("d:\\CS370\\dictionary_crawl\\spanish\\spanish_dict1.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=4)
    else:
        print("No valid entries to save.")