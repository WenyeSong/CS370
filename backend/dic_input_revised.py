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

def get_max_translation_id(cursor):
    """Retrieve the highest translation ID in the translations table to ensure unique IDs."""
    try:
        cursor.execute("SELECT MAX(translation_id) FROM translations;")
        result = cursor.fetchone()
        return result[0] if result[0] is not None else 0 
    except psycopg2.Error as e:
        print(f"Error retrieving maximum translation ID: {e}")
        return 0  

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


        current_max_id = get_max_translation_id(cur)
        translation_id = current_max_id + 1  

        for item in data:
            cur.execute(
                "INSERT INTO Foreign_Table1 (Language_ID, Term) VALUES (%s, %s) RETURNING Foreign_ID;",
                (item['language_id'], item['word'])
            )
            foreign_id = cur.fetchone()
            if foreign_id is None:
                print(f"Failed to insert foreign word: {item['word']}")
                continue

            for english_term, explanation in zip(item['english_term'], item['explanation']):
                cur.execute(
                    "INSERT INTO translations (translation_id, foreign_language_id, english_id, english_term, english_explanation) VALUES (%s, %s, %s, %s, %s);",
                    (translation_id, foreign_id[0], 2, english_term, explanation)
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

insert_data_from_json('d:\\CS370\\dictionary_crawl\\french\\final_french.json')

