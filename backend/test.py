from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test:cs370@localhost/test'
db = SQLAlchemy(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(256))

class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(64), unique=True)
    meaning = db.Column(db.Text)

class UserWord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    word_id = db.Column(db.Integer, db.ForeignKey('word.id'))
    mastery_level = db.Column(db.Integer)

with app.app_context():
    db.create_all()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        # 生成token的逻辑放在这里
        token = 'SOME_GENERATED_TOKEN'
        return jsonify({'token': token}), 200
    else:
        return make_response('Wrong username or password', 401)
    

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # add more logic of validation?
    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['name'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'message': 'Registration successful'}), 200
    except Exception as e:
        # if users already exist
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
    
@app.route('/testdb')
def testdb():
    try:
        # test, if work should print the number of user
        user_count = User.query.count()
        return f"Total number of users: {user_count}"
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    #print("Starting Flask server on port 5000")
    app.run(debug=True, port = 5000)
