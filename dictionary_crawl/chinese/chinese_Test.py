# # import requests
# # from bs4 import BeautifulSoup
# # import io
# # import sys
# # import json
# # from random import random
# # from time import sleep
# # from concurrent.futures import ThreadPoolExecutor

# # # sys.stdout = io.TextIOWrapper(buffer=sys.stdout.buffer,encoding='utf8')

# # def get_word_data(word):
# #     url = f"https://dictionary.cambridge.org/us/dictionary/chinese-simplified-english/{word}"
# #     headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
# #     response = requests.get(url, headers=headers)
# #     soup = BeautifulSoup(response.content, "html.parser")
# #     english_term = soup.select_one("span.dtrans")
# #     if english_term:
# #         english_term = english_term.get_text(strip=True)
# #     explanation = soup.select_one("div.def")
# #     if explanation:
# #         explanation = explanation.get_text(strip=True)
# #     cn_example = soup.select_one("span.dtrans-eg-transzh.lmr-10.hdb")
# #     if cn_example:
# #         cn_example = cn_example.get_text(strip=True)
# #     en_example = soup.select_one("span.dtrans-egzh.lmr-10.hdb")
# #     if en_example:
# #         en_example = en_example.get_text(strip=True)
# #     return {
# #         "word": word,
# #         "english_term": english_term,
# #         "explanation": explanation,
# #         "cn_example": cn_example,
# #         "en_example": en_example,
# #     }

# # def crawl_words(words):
# #     results = []
# #     error = 0
# #     print("Initializing thread pool...")
# #     with ThreadPoolExecutor(max_workers=4) as executor:
# #         futures = []
# #         for i, word in enumerate(words[:4], start=1):
# #             word = word.split()[0]
# #             print(f"Submitting task {i}/{len(words[:100])}")
# #             futures.append(executor.submit(get_word_data, word))
# #             sleep(random() + 1)
# #         print("All tasks submitted. Waiting for results...")
# #         for i, future in enumerate(futures, start=1):
# #             try:
# #                 data = future.result()
# #             except Exception:
# #                 data = {
# #                     "word": words[i - 1],
# #                     "english_term": "error",
# #                     "explanation": "error",
# #                     "cn_example": "error",
# #                     "en_example": "error",
# #                 }
# #                 error += 1
# #             print(f'{i}/{len(words[:1000])}')
# #             results.append(data)
# #     print("Crawling finished")
# #     print(f"Error: {error}")
# #     return results

# # if __name__ == "__main__":
# #     with open("d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt", "r", encoding="utf-8") as f:
# #         words = f.read().splitlines()
# #     results = crawl_words(words)
# #     with open("d:\\CS370\\dictionary_crawl\\chinese\\chinese_dict.json", "w", encoding="utf-8") as f:
# #         json.dump(results, f, ensure_ascii=False, indent=4)
# # import requests
# # from bs4 import BeautifulSoup
# # import json
# # from random import random
# # from time import sleep
# # from concurrent.futures import ThreadPoolExecutor

# # def get_word_data(word):
# #     url = f"https://dictionary.cambridge.org/us/dictionary/chinese-english/{word}"
# #     headers = {'User-Agent': 'Mozilla/5.0'}
# #     response = requests.get(url, headers=headers)
# #     soup = BeautifulSoup(response.content, "html.parser")

# #     page_word = soup.select_one("h2.tw-bw.dhw.dpos-h_hw.di-title")
# #     if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
# #         return None 

# #     real_word_elements = soup.select_one("span.dtrans")
# #     real_word_texts = []
# #     for element in real_word_elements:
# #         sentences = element.get_text(strip=True).split(". ")
# #         filtered_sentences = [sentence for sentence in sentences if '[' in sentence]
# #         if filtered_sentences:
# #             real_word_texts.append(". ".join(filtered_sentences) + ".")

# #     if not real_word_texts:
# #         return None  # Do not return a dictionary if no sentences are suitable

# #     return {
# #         "word": word,
# #         "real_word": real_word_texts
# #     }

# # def crawl_words(words):
# #     results = []
# #     error = 0
# #     word_number = 0  # Initialize word count here, but don't increment yet
# #     print("Initializing thread pool...")
# #     with ThreadPoolExecutor(max_workers=4) as executor:
# #         futures = []
# #         for i, word in enumerate(words[:10], start=1):  # Example limit to first 8 words
# #             word = word.split()[0]  # Treat only the first part of any line as the word
# #             print(f"Submitting task {i}/{len(words)}")
# #             futures.append(executor.submit(get_word_data, word))
# #             sleep(0.01)

# #         print("All tasks submitted. Waiting for results...")
# #         for i, future in enumerate(futures, start=1):
# #             try:
# #                 data = future.result()
# #                 if data:  # Add to results only if data is not None
# #                     word_number += 1  # Increment here when adding to results
# #                     data['word_number'] = word_number  # Add word_number to data
# #                     results.append(data)
# #             except Exception as e:
# #                 print(f"Error processing word '{words[i-1]}': {str(e)}")
# #                 error += 1
# #             print(f'{i}/{len(words)}: Completed')

# #     print("Crawling finished")
# #     print(f"Error count: {error}")
# #     return results

# # if __name__ == "__main__":
# #     with open("d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt", "r", encoding="utf-8") as f:
# #         words = f.read().splitlines()
# #     results = crawl_words(words)
# #     if results:
# #         with open("d:\\CS370\\dictionary_crawl\\chinese\\chinese_dict1.json1", "w", encoding="utf-8") as f:
# #             json.dump(results, f, ensure_ascii=False, indent=4)
# import requests
# from bs4 import BeautifulSoup
# import json
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor
# import random

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/chinese-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     # Check if the correct word page is loaded
#     page_word = soup.find("span", class_="headword")
#     if page_word is None or page_word.get_text(strip=True).lower() != word.lower():
#         return None 

#     # Locate all English english_terms for the word
#     real_word_elements = soup.select("div.def-body > div.def")
#     real_word_texts = []
#     for element in real_word_elements:
#         english_term = element.get_text(strip=True)
#         if english_term:
#             real_word_texts.append(english_term)

#     if not real_word_texts:
#         return None  # Do not return a dictionary if no english_terms are found

#     return {
#         "word": word,
#         "real_words": real_word_texts
#     }

# def crawl_words(words):
#     results = []
#     error_count = 0
#     word_number = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:10], start=1):  # Limit to first 10 words for demonstration
#             print(f"Submitting task {i}/{len(words)}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(0.1)  # Stagger requests to avoid being blocked

#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#                 if data:  # Only add non-None results
#                     word_number += 1
#                     data['word_number'] = word_number
#                     results.append(data)
#             except Exception as e:
#                 print(f"Error processing word '{words[i-1]}': {str(e)}")
#                 error_count += 1
#             print(f'{i}/{len(words)}: Completed')

#     print("Crawling finished")
#     print(f"Error count: {error_count}")
#     return results

# if __name__ == "__main__":
#     with open("d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     if results:
#         with open("d:\\CS370\\dictionary_crawl\\chinese\\chinese_dict1.json", "w", encoding="utf-8") as f:
#             json.dump(results, f, ensure_ascii=False, indent=4)
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
    # Extracting english_term and explanation
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
        for i, word in enumerate(words[:10000], start=1):  
            word = word.split()[0]
            print(f"Submitting task {i}/{len(words)}")
            futures.append(executor.submit(get_word_data, word))
            sleep(0.01)  # Staggering requests to avoid being blocked
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
# import requests
# from bs4 import BeautifulSoup
# import json
# from random import random
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/chinese-simplified-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     # Extract all english_terms and explanations
#     english_terms = soup.select("span.dtrans")
#     explanations = soup.select("div.def")

#     # Gather all english_terms into a list
#     english_term_list = [trans.get_text(strip=True) for trans in english_terms if trans.get_text(strip=True)]

#     # Gather all explanations into a list
#     explanation_list = [exp.get_text(strip=True) for exp in explanations if exp.get_text(strip=True)]

#     return {
#         "word": word,
#         "english_terms": english_term_list,
#         "explanations": explanation_list
#     }

# def crawl_words(words):
#     results = []
#     error = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:10], start=1):  # Limiting for demonstration purposes
#             word = word.split()[0]  # Assuming words are space-separated in lines
#             print(f"Submitting task {i}/{len(words)}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(random() * 0.1)  # Stagger requests slightly to mitigate risk of blocking
#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#                 if data['english_terms'] or data['explanations']:  # Only add non-empty results
#                     results.append(data)
#             except Exception as e:
#                 print(f"Error processing word '{words[i-1]}': {str(e)}")
#                 results.append({
#                     "word": words[i - 1],
#                     "english_terms": ["error"],
#                     "explanations": ["error"]
#                 })
#                 error += 1
#             print(f'{i}/{len(words)}: Completed')
#     print("Crawling finished")
#     print(f"Error count: {error}")
#     return results

# if __name__ == "__main__":
#     with open("d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     if results:
#         with open("d:\\CS370\\dictionary_crawl\\chinese\\chinese_dict.json", "w", encoding="utf-8") as f:
#             json.dump(results, f, ensure_ascii=False, indent=4)

# import requests
# from bs4 import BeautifulSoup
# import json
# from random import random
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/chinese-simplified-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     # Check if the word on the page is exactly the word searched for
#     page_word = soup.select_one("span.hw.dhw")
#     if not page_word != word:
#         return {
#             "word": word,
#             "english_terms": [],
#             "explanations": [],
#             "error": "No exact match found"
#         }

#     # Extract all english_terms and explanations
#     english_terms = soup.select("span.dtrans")
#     explanations = soup.select("div.def-body > div.def")

#     # Gather all english_terms into a list
#     english_term_list = [trans.get_text(strip=True) for trans in english_terms if trans.get_text(strip=True)]

#     # Gather all explanations into a list
#     explanation_list = [exp.get_text(strip=True) for exp in explanations if exp.get_text(strip=True)]

#     return {
#         "word": word,
#         "english_terms": english_term_list,
#         "explanations": explanation_list
#     }

# def crawl_words(words):
#     results = []
#     error = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:10], start=1):
#             word = word.split()[0]
#             print(f"Submitting task {i}/{len(words)}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(random() * 0.1)
#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#                 if "error" not in data:
#                     results.append(data)
#                 else:
#                     print(f"Error for {data['word']}: {data['error']}")
#                     error += 1
#             except Exception as e:
#                 print(f"Error processing word '{words[i-1]}': {str(e)}")
#                 error += 1
#             print(f'{i}/{len(words)}: Completed')
#     print("Crawling finished")
#     print(f"Error count: {error}")
#     return results

# if __name__ == "__main__":
#     with open("d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     if results:
#         with open("d:\\CS370\\dictionary_crawl\\chinese\\chinese_dict.json", "w", encoding="utf-8") as f:
#             json.dump(results, f, ensure_ascii=False, indent=4)
# import requests
# from bs4 import BeautifulSoup
# import json
# from random import random
# from time import sleep
# from concurrent.futures import ThreadPoolExecutor

# def get_word_data(word):
#     url = f"https://dictionary.cambridge.org/us/dictionary/chinese-simplified-english/{word}"
#     headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.content, "html.parser")

#     # Locate the first occurrence of the word and its related content block
#     word_element = soup.find("h2", class_="tw-bw dhw dpos-h_hw di-title", lang="zh-Hans")
#     if word_element and word_element.get_text(strip=True) == word:
#         content_block = word_element.find_next("div", class_="entry-body__el")
#         if content_block:
#             english_terms = content_block.select("span.dtrans")
#             explanations = content_block.select("div.def")

#             # Extract english_terms
#             english_term_list = [trans.get_text(strip=True) for trans in english_terms]

#             # Extract explanations
#             explanation_list = [exp.get_text(strip=True) for exp in explanations]

#             return {
#                 "word": word,
#                 "english_terms": english_term_list,
#                 "explanations": explanation_list
#             }
    
#     # Return an empty list if the word or content block is not found
#     return {
#         "word": word,
#         "english_terms": [],
#         "explanations": [],
#         "error": "No content found for the first matched word"
#     }

# def crawl_words(words):
#     results = []
#     error = 0
#     print("Initializing thread pool...")
#     with ThreadPoolExecutor(max_workers=4) as executor:
#         futures = []
#         for i, word in enumerate(words[:10], start=1):
#             word = word.split()[0]  # Assuming words are split by spaces if necessary
#             print(f"Submitting task {i}/{len(words)}")
#             futures.append(executor.submit(get_word_data, word))
#             sleep(random() * 0.1)  # Staggering requests to avoid being blocked
#         print("All tasks submitted. Waiting for results...")
#         for i, future in enumerate(futures, start=1):
#             try:
#                 data = future.result()
#                 if data['english_terms'] or data['explanations']:
#                     results.append(data)
#                 else:
#                     print(f"Error for {data['word']}: {data['error']}")
#                     error += 1
#             except Exception as e:
#                 print(f"Error processing word '{words[i-1]}': {str(e)}")
#                 results.append({
#                     "word": words[i - 1],
#                     "english_terms": ["error"],
#                     "explanations": ["error"]
#                 })
#                 error += 1
#             print(f'{i}/{len(words)}: Completed')
#     print("Crawling finished")
#     print(f"Error count: {error}")
#     return results

# if __name__ == "__main__":
#     with open("d:\\CS370\\dictionary_crawl\\chinese\\filtered_words_chinese.txt", "r", encoding="utf-8") as f:
#         words = f.read().splitlines()
#     results = crawl_words(words)
#     if results:
#         with open("d:\\CS370\\dictionary_crawl\\chinese\\chinese_dict.json", "w", encoding="utf-8") as f:
#             json.dump(results, f, ensure_ascii=False, indent=4)
