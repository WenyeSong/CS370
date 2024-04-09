from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from login import login_routes  
from save_list import delete_user_word, get_user_words, save_user_word
from register import register_routes
from db import db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:cs370@34.69.154.109/postgres'
db.init_app(app)


# register each app
login_routes(app)
register_routes(app)

# Assuming `app` is your Flask application instance
# and assuming `add_foreign_word` is imported or defined in the same file

app.add_url_rule('/user/<string:token>/words/<int:foreign_id>', view_func=delete_user_word, methods=['DELETE'])
app.add_url_rule('/user/<string:token>/words', view_func=get_user_words, methods=['GET'])
app.add_url_rule('/user/<string:token>/words', view_func=save_user_word, methods=['POST'])




if __name__ == '__main__':
    with app.app_context():
        db.create_all()
# This should be called with caution, only when needed

    app.run(debug=True, port=5000)  # starts the app
