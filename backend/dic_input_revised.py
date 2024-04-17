# import psycopg2
# import json

# def get_language_id(language_name, cursor):
#     """Fetch the language ID for a given language name."""
#     cursor.execute("SELECT Language_ID FROM Languages WHERE Language_Name = %s;", (language_name,))
#     result = cursor.fetchone()
#     if result:
#         return result[0]
#     else:
#         return None

# def insert_data_from_json(json_file_path):
#     with open(json_file_path, 'r') as file:
#         data = json.load(file)
    
#     conn = psycopg2.connect(
#         dbname='postgres',
#         user='postgres',
#         password='cs370',
#         host='34.69.154.109',
#         sslmode='disable'
#     )
#     cur = conn.cursor()

#     # Assuming "French" and "English" language IDs are pre-inserted in the Languages table
#     french_id = get_language_id('French', cur)
#     english_id = get_language_id('English', cur)

#     if not french_id or not english_id:
#         print("Language IDs for 'French' or 'English' not found. Ensure they are inserted into the Languages table.")
#         return

#     translation_id = 1  # Start translation ID from 1

#     for item in data:
#         # Check for required keys
#         if 'word' not in item or 'english_term' not in item or 'explanation' not in item:
#             print("Missing 'word', 'english_term', or 'explanation' keys in one or more items.")
#             continue

#         # # Insert the French term
#         # cur.execute(
#         #     "INSERT INTO Foreign_Terms (Language_ID, Term) VALUES (%s, %s) RETURNING Foreign_ID;",
#         #     (french_id, item['word'])
#         # )
#         foreign_id = cur.fetchone()[0]

#         # Insert each English translation and its explanation
#         for english_term, explanation in zip(item['english_term'], item['explanation']):
#             cur.execute(
#                 "INSERT INTO translations (translation_id, foreign_id, english_id, english_term, english_explanation) VALUES (%s, %s, %s, %s, %s);",
#                 (translation_id, foreign_id, english_id, english_term, explanation)
#             )
#             translation_id += 1  # Increment translation_id for each new entry

#         conn.commit()

#     cur.close()
#     conn.close()

import psycopg2
import json

def get_language_id(language_name, cursor):
    try:
        cursor.execute("SELECT Language_ID FROM Languages WHERE Language_Name = %s;", (language_name,))
        result = cursor.fetchone()
        return result[0] if result else None
    except psycopg2.Error as e:
        print(f"Error fetching language ID for {language_name}: {e}")
        return None

def insert_data_from_json(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='cs370',
            host='34.69.154.109',
            sslmode='disable'
        )
        cur = conn.cursor()

        french_id = get_language_id('French', cur)
        english_id = get_language_id('English', cur)
        if not french_id or not english_id:
            print("Language IDs for 'French' or 'English' not found. Ensure they are inserted into the Languages table.")
            return

        translation_id = 1
        for item in data:
            if 'word' not in item or 'english_term' not in item or 'explanation' not in item:
                print("Missing required keys in JSON data.")
                continue

            cur.execute(
                "INSERT INTO Foreign_Terms (Language_ID, Term) VALUES (%s, %s) RETURNING Foreign_ID;",
                (french_id, item['word'])
            )
            foreign_id = cur.fetchone()
            if not foreign_id:
                print(f"Failed to insert term {item['word']} or retrieve Foreign_ID.")
                continue

            for english_term, explanation in zip(item['english_term'], item['explanation']):
                cur.execute(
                    "INSERT INTO translations (translation_id, foreign_id, english_id, english_term, english_explanation) VALUES (%s, %s, %s, %s, %s);",
                    (translation_id, foreign_id[0], english_id, english_term, explanation)
                )
                translation_id += 1

            conn.commit()

    except psycopg2.Error as db_error:
        print(f"Database error: {db_error}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

insert_data_from_json('d:\\CS370\\dictionary_crawl\\french\\modified_data.json')
