import requests
from bs4 import BeautifulSoup
import json
from random import random
from time import sleep
from concurrent.futures import ThreadPoolExecutor

def get_word_data(word):
    url = f"https://dictionary.cambridge.org/us/dictionary/chinese-simplified-english/{word}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    word_element = soup.find("h2", class_="tw-bw dhw dpos-h_hw di-title", lang="zh-Hans")
    if word_element is None or word_element.get_text(strip=True).lower() != word.lower():
        return None 
    english_term = soup.select_one("span.dtrans")
    english_term = english_term.get_text(strip=True) if english_term else None

    explanation = soup.select_one("div.def")
    explanation = explanation.get_text(strip=True) if explanation else None

    return {
        "word": word,
        "english_term": english_term,
        "explanation": explanation
    }

def crawl_words(words):
    results = []
    error = 0
    print("Initializing thread pool...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        #you can change the number in words[;] to change the number you want to crawl!
        for i, word in enumerate(words[:10000], start=1):  
            word = word.split()[0]
            print(f"Submitting task {i}/{len(words)}")
            futures.append(executor.submit(get_word_data, word))
            sleep(0.01)  
        print("All tasks submitted. Waiting for results...")
        for i, future in enumerate(futures, start=1):
            try:
                data = future.result()
                results.append(data)
            except Exception as e:
                print(f"Error processing word '{words[i-1]}': {str(e)}")
                results.append({
                    "word": words[i - 1],
                    "english_term": "error",
                    "explanation": "error"
                })
                error += 1
            print(f'{i}/{len(words)}: Completed')
    print("Crawling finished")
    print(f"Error count: {error}")
    return results

if __name__ == "__main__":
    with open("d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt", "r", encoding="utf-8") as f:
        words = f.read().splitlines()
    results = crawl_words(words)
    if results:
        with open("d:\\CS370\\dictionary_crawl\\chinese\\chinese_dict.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=4)