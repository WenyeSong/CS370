import psycopg2
from flask import Flask, request, jsonify, make_response
from werkzeug.security import check_password_hash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from db import db, User, Language, ForeignTerm, EnglishTranslation, UserSaved


#app = Flask(__name__)
#CORS(app)

# class User(db.Model):
#     __tablename__ = 'users'  
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     token = db.Column(db.String(80),unique=True, nullable=False)

def login_routes(app):
# check whether status is activate using GET
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'UP'}), 200


    @app.route('/api/login', methods=['POST'])
    def login():
        # Parse the JSON request to get username and password
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Connection details
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='cs370',  
            host='34.69.154.109',  
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
                    user=User.query.filter_by(username=username).first()
                    user.token=token
                    db.session.commit()
                    
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