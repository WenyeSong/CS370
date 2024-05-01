# import requests
# from bs4 import BeautifulSoup
# import io
# import sys
# import json
# from random import random
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor


# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/french-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     page_word = soup.select_one("h2.tw-bw.dhw.dpos-h_hw.di-title")
#     if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
#         return None 

#     # Assuming you're trying to get a definition or similar as 'real_word'
#     real_word_elements = soup.select("div.def-body.ddef_b.ddef_b-t")
#     real_word_texts = [element.get_text(strip=True) for element in real_word_elements]

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
#         "real_word": real_word_texts,  # Now 'real_word' contains a list of texts
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


# def crawl_words(words):
#     results = []
#     error = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:30], start=1):
#             word = word.split()[0]
#             print(f"Submitting task {i}/{len(words)}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(random() + 0.2)

#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#             except Exception:
#                 data = {
#                     "word": words[i - 1],
#                     "real_word": None,
#                     "translation": "error",
#                     "explanations": [],
#                     "cn_examples": [],
#                     "en_examples": [],
#                     "chosen_cn_example": None,
#                     "chosen_en_example": None,
#                 }
#                 error += 1
#             print(f'{i}/{len(words)}')
#             results.append(data)

#     print("Crawling finished")
#     print(f"Error: {error}")
#     return results

# if __name__ == "__main__":
#     with open("d:\\CS370\\dictionary_crawl\\french\\filtered_words1.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     with open("d:\\CS370\\dictionary_crawl\\french\\french_dict.json", "w", encoding="utf-8") as f:
#         json.dump(results, f, ensure_ascii=False, indent=4)

# import requests
# from bs4 import BeautifulSoup
# import json
# from random import random
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/french-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     page_word = soup.select_one("h2.tw-bw.dhw.dpos-h_hw.di-title")
#     if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
#         return None 

#     # Collecting definitions and ensuring they contain '['
#     real_word_elements = soup.select("div.def-body.ddef_b.ddef_b-t")
#     real_word_texts = [element.get_text(strip=True) for element in real_word_elements if '[' in element.get_text()]

#     # Collect only required information
#     data = {
#         "word": word,
#         "real_word": real_word_texts if real_word_texts else None  # Ensure null values are handled correctly
#     }

#     return data

# def crawl_words(words):
#     results = []
#     error = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:10], start=1):  # Example limit to first 10 words
#             word = word.split()[0]  # Ensure only the first part of any line is treated as the word
#             print(f"Submitting task {i}/{len(words)}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(random() + 0.2)

#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#             except Exception as e:
#                 data = {
#                     "word": words[i - 1],
#                     "real_word": None  # Handle exceptions by setting 'real_word' to None
#                 }
#                 error += 1
#             print(f'{i}/{len(words)}: Completed')
#             results.append(data)

#     print("Crawling finished")
#     print(f"Error count: {error}")
#     return results

# if __name__ == "__main__":
#     with open("d:\\CS370\\dictionary_crawl\\french\\filtered_words1.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     with open("d:\\CS370\\dictionary_crawl\\french\\french_dict.json", "w", encoding="utf-8") as f:
#         json.dump(results, f, ensure_ascii=False, indent=4)
# import requests
# from bs4 import BeautifulSoup
# import json
# from random import random
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/french-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     page_word = soup.select_one("h2.tw-bw.dhw.dpos-h_hw.di-title")
#     if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
#         return None  # If the word does not exactly match, return None

#     real_word_elements = soup.select("div.def-body.ddef_b.ddef_b-t")
#     real_word_texts = []
#     for element in real_word_elements:
#         sentences = element.get_text(strip=True).split(". ")
#         filtered_sentences = [sentence for sentence in sentences if '[' in sentence]
#         if filtered_sentences:
#             real_word_texts.append(". ".join(filtered_sentences) + ".")  # Join sentences back into a paragraph

#     if not real_word_texts:
#         return None  # Do not return a data dictionary if no sentences contain '['

#     data = {
#         "word": word,
#         "real_word": real_word_texts
#     }

#     return data

# def crawl_words(words):
#     results = []
#     error = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:10], start=1):
#             print(f"Submitting task {i}/{len(words)}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(random() + 0.2)

#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#                 if data:  # Only append data if it is not None
#                     results.append(data)
#             except Exception as e:
#                 print(f"Error processing word '{words[i-1]}': {str(e)}")
#                 error += 1
#                 results.append({
#                     "word": words[i-1],
#                     "real_word": None
#                 })  # Include error entries with None to track failed requests
#             print(f'{i}/{len(words)}: Completed')

#     print("Crawling finished with {error} errors.")
#     return results

# if __name__ == "__main__":
#     with open("d:\\CS370\\dictionary_crawl\\french\\filtered_words1.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     results_with_data = [result for result in results if result['real_word'] is not None]  # Filter out any results with None real_words
#     if results_with_data:
#         with open("d:\\CS370\\dictionary_crawl\\french\\french_dict.json", "w", encoding="utf-8") as f:
#             json.dump(results_with_data, f, ensure_ascii=False, indent=4)
#         print(f"Data saved to french_dict.json with {len(results_with_data)} entries.")
#     else:
#         print("No valid entries to save. The output JSON file will not be created.")
import requests
from bs4 import BeautifulSoup
import json
from random import random
from time import sleep
from concurrent.futures import ThreadPoolExecutor

def get_word_data(word):
    url = f"https://dictionary.cambridge.org/us/dictionary/french-english/{word}"
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
        #you can change the number in words[;] to change the number you want to crawl!
        for i, word in enumerate(words[:6772], start=1): 
            word = word.split()[0]  
            print(f"Submitting task {i}/{len(words)}")
            futures.append(executor.submit(get_word_data, word))
            sleep(random() + 0.2)

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
    with open("d:\\CS370\\dictionary_crawl\\french\\filtered_words1.txt", "r", encoding="utf-8") as f:
        words = f.read().splitlines()
    results = crawl_words(words)
    if results:
        with open("d:\\CS370\\dictionary_crawl\\french\\french_dict1.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=4)
    else:
        print("No valid entries to save.")



