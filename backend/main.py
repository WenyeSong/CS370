from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from login import login_routes  
from save_list import delete_user_saved_word, get_user_words, save_user_word, delete_user_contribution, search_similar
from voctest import get_random_words
from register import register_routes
from db import db
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:cs370@34.69.154.109/postgres'
db.init_app(app)


# register each app
login_routes(app)
register_routes(app)


app.add_url_rule('/api/user/<string:token>/words/<int:foreign_id>', view_func=delete_user_saved_word, methods=['DELETE'])
app.add_url_rule('/api/user/<string:token>/contributions/<int:contribution_id>', view_func=delete_user_contribution, methods=['DELETE'])
app.add_url_rule('/api/user/<string:token>/words', view_func=get_user_words, methods=['GET'])
app.add_url_rule('/api/user/<string:token>/words', view_func=save_user_word, methods=['POST'])
app.add_url_rule('/api/user/words/<string:word>', view_func=search_similar, methods=['GET'])
app.add_url_rule('/api/user/words/<int:language_id>', view_func=get_random_words, methods=['GET'])


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
# This should be called with caution, only when needed
    #port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=5000) # starts the app with deploy, with a public port
    #app.run(debug=True, port = 5000) # original test, without deploy
