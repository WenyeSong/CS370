import psycopg2
import json

def insert_data_from_json(json_file_path):
    # Load the JSON data
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='cs370',  # Replace with your password
        host='34.69.154.109',  # Replace with your host IP
        sslmode='disable'  # SSL mode is disabled for this example, adjust as necessary
    )
    cur = conn.cursor()
    
    try:
        for french_term, translations in data.items():
            # Insert the French term and get its generated ID
            cur.execute("INSERT INTO french_terms (term) VALUES (%s) ON CONFLICT (term) DO NOTHING RETURNING id;", (french_term,))
            result = cur.fetchone()
            if result:
                french_term_id = result[0]
            else:
                cur.execute("SELECT id FROM french_terms WHERE term = %s;", (french_term,))
                french_term_id = cur.fetchone()[0]
            
            # Insert each English translation linked to the French term's ID
            for translation in translations:
                cur.execute("INSERT INTO english_translations (french_term_id, translation) VALUES (%s, %s) ON CONFLICT DO NOTHING;", (french_term_id, translation))

        # Commit the changes
        conn.commit()
    except Exception as e:
        # Rollback in case there is any error
        conn.rollback()
        print(f"An error occurred: {e}")
    finally:
        # Close communication with the database
        cur.close()
        conn.close()

if __name__ == '__main__':
    insert_data_from_json('/Users/jinjiahui/Desktop/cs370/CS370/frontend/src/pages/Voctest/french-english.json')

