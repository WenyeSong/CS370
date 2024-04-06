import psycopg2
from flask import Flask, request, jsonify, make_response
from werkzeug.security import check_password_hash
from flask_cors import CORS

#app = Flask(__name__)
#CORS(app)

def login_routes(app):
# check whether status is activate
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'UP'}), 200


    @app.route('/login', methods=['POST'])
    def login():
        # Parse the JSON request to get username and password
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Connection details
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='cs370',  # Replace with your actual password
            host='34.69.154.109',  # Replace with your actual host IP
        )

        # Cursor to execute database operations
        cur = conn.cursor()

        try:
            # SQL query to fetch the user's hashed password from the database
            cur.execute("SELECT password_hash FROM users WHERE username = %s", (username,))
            user_record = cur.fetchone()

            if user_record:
                password_hash = user_record[0]
                print(password_hash, "database: ", user_record[0])
                # Verify the provided password against the stored hashed password
                if password_hash == password: # if hash later, change this code to : if check_password_hash(password_hash, password):
                    # Password is correct
                    token=username+'-'+password
                    return jsonify({'message': 'Login is successful!','token':token}), 200
                else:
                    # Password is incorrect
                    return make_response('Wrong username or password11', 401)
            else:
                # Username not found
                return make_response('Username not found', 401)

        except Exception as e:
         # Handle any errors that occur during the process
            return jsonify({'message': str(e)}), 500
        finally:
            # Close communication with the database
            cur.close()
            conn.close()