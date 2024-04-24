from flask import Flask, jsonify, send_file
import mysql.connector
import json

app = Flask(__name__)

# Connect to Google Cloud SQL database
def connect_to_database():
    return mysql.connector.connect(
        database='postgres',
        user='postgres',
        password='cs370',  
        host='34.69.154.109',  
        sslmode='disable'  # SSL mode is disabled for this example, adjust as necessary
        )

# Example function to fetch words from the database
def fetch_words_from_database():
    try:
        connection = connect_to_database()
        cursor = connection.cursor(dictionary=True)
        
        # Modified SQL query to fetch words and definitions using a JOIN operation
        cursor.execute("""
           SELECT term, english_term FROM user_saved JOIN english_translations ON user_saved.foreign_ID = english_translations.foreign_ID JOIN foreign_terms ON user_saved.foreign_ID = foreign_terms.foreign_ID WHERE USER_ID = 7;
        """)
        
        words = cursor.fetchall()
        print(words)
        data_dict = {}

        for row in words:
            term, english_term = row
            if term in data_dict:
                data_dict[term].append(english_term)
            else:
                data_dict[term] = [english_term]

        json_data = json.dumps(data_dict, indent=4)

        with open('output.json', 'w') as json_file:
            json_file.write(json_data)

        return json_file
        
    except Exception as e:
        print("Error fetching words:", e)
        return []

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/words', methods=['GET'])
def get_words():
    # Fetch words from the database
    print("words here")
    data_dict = fetch_words_from_database()
    # Return the data as JSON
    return jsonify(data_dict)

@app.route('/download')
def download():
    return send_file('output.json')

if __name__ == '__main__':
    app.run(debug=True)
