import psycopg2

def create_tables():
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='cs370',  
        host='34.69.154.109',  
        sslmode='disable'  # SSL mode is disabled for this example, adjust as necessary
    )
    cur = conn.cursor()

    # Commands to create the tables
    commands = [
        '''
        CREATE TABLE french_terms (
            id SERIAL PRIMARY KEY,
            term VARCHAR(255) UNIQUE NOT NULL
        )
        ''',
        '''
        CREATE TABLE english_translations (
            id SERIAL PRIMARY KEY,
            french_term_id INTEGER NOT NULL,
            translation VARCHAR(255) NOT NULL,
            FOREIGN KEY (french_term_id) REFERENCES french_terms (id)
        )
        '''
    ]

    try:
        # Execute each command
        for command in commands:
            cur.execute(command)
        # Commit the changes to the database
        conn.commit()
        print("Tables created successfully.")
    except Exception as e:
        # Rollback in case there is any error
        conn.rollback()
        print(f"An error occurred: {e}")
    finally:
        # Close communication with the database
        cur.close()
        conn.close()

if __name__ == '__main__':
    create_tables()

