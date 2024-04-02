from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)  # This will allow all origins. For specific origins, use the `resources` argument.

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:cs370@34.69.154.109/postgres'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'  # Explicitly specify the table name to match your database
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # Other fields...


class FrenchTerm(db.Model):
    __tablename__ = 'french_terms'
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(255), unique=True, nullable=False)
    english_translations = db.relationship('EnglishTranslation', backref='french_term', lazy='dynamic')

class EnglishTranslation(db.Model):
    __tablename__ = 'english_translations'
    id = db.Column(db.Integer, primary_key=True)
    french_term_id = db.Column(db.Integer, db.ForeignKey('french_terms.id'), nullable=False)
    translation = db.Column(db.String(255), nullable=False)


class UserWord(db.Model):
    __tablename__ = 'user_words'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    french_term_id = db.Column(db.Integer, db.ForeignKey('french_terms.id'), nullable=False)
    mastery_level = db.Column(db.Integer)
    # Add other fields if necessary




@app.route('/user/<int:user_id>/words/<int:word_id>', methods=['DELETE'])
def delete_user_word(user_id, word_id):
    try:
        user_word = UserWord.query.filter_by(user_id=user_id, id=word_id).first()
        if not user_word:
            return jsonify({'message': 'Word not found'}), 404

        db.session.delete(user_word)
        db.session.commit()
        return jsonify({'message': 'Word deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


    

# @app.route('/user/<int:user_id>/words', methods=['GET'])
# def get_user_words(user_id):
#     user_words = UserWord.query.filter_by(user_id=user_id).all()
#     saved_words_info = []

#     for user_word in user_words:
#         french_term = FrenchTerm.query.get(user_word.french_term_id)
#         translations = [translation.translation for translation in french_term.english_translations]
#         saved_words_info.append({
#             "word": french_term.term,
#             "definition": ", ".join(translations)  # Combine all translations into a single string
#         })

#     return jsonify(saved_words_info)

@app.route('/user/<int:user_id>/words', methods=['GET'])
def get_user_words(user_id):
    user_words = UserWord.query.filter_by(user_id=user_id).all()
    saved_words_info = []

    for user_word in user_words:
        french_term = FrenchTerm.query.get(user_word.french_term_id)
        translations = [translation.translation for translation in french_term.english_translations]
        saved_words_info.append({
            "id": user_word.id,  # Include the UserWord id here
            "french_word": french_term.term,
            "english_translations": [translation.translation for translation in french_term.english_translations],
            "mastery_level": user_word.mastery_level
        })

    return jsonify(saved_words_info)


@app.route('/user/<int:user_id>/words', methods=['POST'])
def save_user_word(user_id):
    data = request.json
    french_term_id = data['french_term_id']  # This should be the ID of the French word the user wants to save
    mastery_level = data.get('mastery_level', 1)  # A default mastery level if not provided

    # Check if the user exists
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    # Create a new UserWord entry
    new_user_word = UserWord(user_id=user_id, french_term_id=french_term_id, mastery_level=mastery_level)
    db.session.add(new_user_word)
    db.session.commit()

    return jsonify({"message": "Word saved successfully", "word_id": new_user_word.id}), 201


def add_first_ten_french_words_to_user(user_id):
    # Assuming user_id = 7 for "Wenye Song"
    # Get the first ten French terms by ID
    french_terms = FrenchTerm.query.order_by(FrenchTerm.id).limit(10).all()

    for term in french_terms:
        # Check if the user-word association already exists to avoid duplicates
        existing_user_word = UserWord.query.filter_by(user_id=user_id, french_term_id=term.id).first()
        if not existing_user_word:
            # Create a new UserWord association with a default mastery level (e.g., 1)
            new_user_word = UserWord(user_id=user_id, french_term_id=term.id, mastery_level=1)
            db.session.add(new_user_word)

    db.session.commit()



if __name__ == "__main__":


    with app.app_context():
        db.create_all()  # This creates the database tables if they don't exist
        add_first_ten_french_words_to_user(7)

    app.run(debug=True)
