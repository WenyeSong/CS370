import psycopg2
from flask import Flask, request, jsonify, make_response
from werkzeug.security import generate_password_hash
from flask_cors import CORS

#app = Flask(__name__)
#CORS(app)


def register_routes(app):
    # Example modified /register route using psycopg2
    @app.route('http://3.138.117.40/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        hashed_password = (data['password'])
    
        # Connection details
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='cs370',  
            host='34.69.154.109',  
        )

        # Cursor to execute database operations
        cur = conn.cursor()

        # SQL statement to insert a new user
        insert_user_sql = '''
        INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)
        '''
        try:
            # Execute the SQL statement
            cur.execute(insert_user_sql, (data['name'], data['email'], hashed_password))
        
            # Commit the changes to the database
            conn.commit()
            return jsonify({'message': 'Registration successful'}), 200
        except Exception as e:
            # Rollback in case there is any error
            conn.rollback()
            return jsonify({'message': str(e)}), 500
        finally:
            # Close communication with the database
            cur.close()
            conn.close()

#if __name__ == '__main__':
    #app.run(debug=True, port=5000)
