import psycopg2
import json

def get_language_id(language_name, cursor):
    """Fetch the language ID for a given language name."""
    cursor.execute("SELECT Language_ID FROM Languages WHERE Language_Name = %s;", (language_name,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        return None

def insert_data_from_json(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='postgres',
        host='34.69.154.109',
        sslmode='disable'
    )
    cur = conn.cursor()

    # Assuming "French" and "English" language IDs are pre-inserted in the Languages table
    french_id = get_language_id('French', cur)
    english_id = get_language_id('English', cur)

    if not french_id or not english_id:
        print("Language IDs for 'French' or 'English' not found. Ensure they are inserted into the Languages table.")
        return

    for foreign_term, english_terms in data.items():
        # Insert the French term
        cur.execute(
            "INSERT INTO Foreign_Terms (Language_ID, Term) VALUES (%s, %s) RETURNING Foreign_ID;",
            (french_id, foreign_term)
        )
        foreign_id = cur.fetchone()[0]

        # Insert each English translation
        for english_term in english_terms:
            cur.execute(
                "INSERT INTO English_Translations (Foreign_ID, English_ID, English_Term) VALUES (%s, %s, %s);",
                (foreign_id, english_id, english_term)
            )

        conn.commit()

    cur.close()
    conn.close()

# Adjust the path to your actual JSON file path
insert_data_from_json('/Users/jinjiahui/Desktop/cs370/CS370/frontend/src/pages/Voctest/french-english.json')
