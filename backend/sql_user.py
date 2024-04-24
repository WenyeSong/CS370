import psycopg2

def create_table():
    # Connection details
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='cs370',  
        host='34.69.154.109',  
        sslmode='disable'  # SSL mode is disabled
    )

    # Cursor to execute database operations
    cur = conn.cursor()
    
    # SQL statement to create a new table
    create_table_sql = '''
    CREATE TABLE user (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
    '''
    
    try:
        # Execute the SQL statement
        cur.execute(create_table_sql)
        
        # Commit the changes to the database
        conn.commit()
        print("Table created successfully.")
    except Exception as e:
        # Rollback in case there is any error
        conn.rollback()
        print(f"An error occurred: {e}")
    finally:
        # Close communication with the database
        cur.close()
        conn.close()

if __name__ == '__main__':
    create_table()
