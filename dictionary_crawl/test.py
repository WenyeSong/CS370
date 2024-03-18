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

    # fetched_word = soup.select("div.dpos-h di-head normal-entry")
    # print(fetched_word)
    # fetched_words = [fetched.get_text(strip=True) for fetched in fetched_word]
    # print(fetched_words)
    
    # if word not in fetched_words:
    #     data["translation"] = None
    #     data["explanations"] = None
    #     data["cn_examples"] = None
    #     data["en_examples"] = None
    #     data["chosen_cn_example"] = None
    #     data["chosen_en_example"] = None
    #     return data
    
    translation = soup.select_one("span.dtrans")
    
    if translation:
        translation = translation.get_text(strip=True)

    explanation = soup.select_one("div.def")
    if explanation:
        explanation = explanation.get_text(strip=True)

    cn_examples = soup.select("span.dtrans-eg-transzh.lmr-10.hdb")
    cn_example_texts = [cn_example.get_text(strip=True) for cn_example in cn_examples]

    en_examples = soup.select("span.dtrans-egzh.lmr-10.hdb")
    en_example_texts = [en_example.get_text(strip=True) for en_example in en_examples]

    data = {
        "word": word,
        "translation": translation,
        "explanations": explanation,
        "cn_examples": cn_example_texts,
        "en_examples": en_example_texts,
    }
    
    
    
    for cn_example, en_example in zip(cn_example_texts, en_example_texts):
        if word in cn_example:
            data["chosen_cn_example"] = cn_example
            data["chosen_en_example"] = en_example
            break
    else:
        data["chosen_cn_example"] = None
        data["chosen_en_example"] = None
    
    
    
    return data

def crawl_words(words):
    results = []
    error = 0
    print("Initializing thread pool...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        for i, word in enumerate(words[:100], start=1):
            word = word.split()[0]
            print(f"Submitting task {i}/{len(words)}")
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
    # you might need to add the parent directory to the path, depending on your setup
    with open("./chinese/chinese_list.txt", "r", encoding="utf-8") as f:
        words = f.read().splitlines()
    results = crawl_words(words)
    with open("./chinese/chinese_dict.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
        