from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from db import db, User, Language, ForeignTerm, EnglishTranslation, UserSaved

#app = Flask(__name__)
#CORS(app)  # This will allow all origins. For specific origins, use the `resources` argument.

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:cs370@34.69.154.109/postgres'
#db = SQLAlchemy(app)
# db = SQLAlchemy()

# class User(db.Model):
#     __tablename__ = 'users'  # Explicitly specify the table name to match your database
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     token = db.Column(db.String(80),unique=True, nullable=False)
#     # Other fields...


# class Language(db.Model):
#     __tablename__ = 'languages'
#     language_id = db.Column(db.Integer, primary_key=True)
#     language_name = db.Column(db.String(255), nullable=False)

# class ForeignTerm(db.Model):
#     __tablename__ = 'foreign_terms'
#     foreign_id = db.Column(db.Integer, primary_key=True)
#     language_id = db.Column(db.Integer, db.ForeignKey('languages.language_id'), nullable=False)
#     term = db.Column(db.String(255), nullable=False)
#     english_translations = db.relationship('EnglishTranslation', backref='foreign_term', lazy='dynamic')

# class EnglishTranslation(db.Model):
#     __tablename__ = 'english_translations'
#     translation_id = db.Column(db.Integer, primary_key=True)
#     foreign_id = db.Column(db.Integer, db.ForeignKey('foreign_terms.foreign_id'), nullable=False)
#     english_id = db.Column(db.Integer)  # Assuming this relates to a language ID for English, might require adjustment
#     english_term = db.Column(db.String(255), nullable=False)



# class UserSaved(db.Model):
#     __tablename__ = 'user_saved'
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)  # Corrected ForeignKey reference
#     foreign_id = db.Column(db.Integer, db.ForeignKey('foreign_terms.foreign_id'), primary_key=True)



def delete_user_word(token, foreign_id):
    try:
        print(token)
        user_id=User.query.filter_by(token=token).first().id
        user_word = UserSaved.query.filter_by(user_id=user_id, foreign_id=foreign_id).first()
        if not user_word:
            return jsonify({'message': 'Word not found'}), 404

        db.session.delete(user_word)
        db.session.commit()
        return jsonify({'message': 'Word deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()  # Rollback the transaction to avoid any db lock issues.
        print(f"Error when trying to delete word: {e}")  # Log the error
        return jsonify({'message': str(e)}), 500

    

def get_user_words(token):
    user_id = User.query.filter_by(token=token).first().id
    print(user_id)
    
    user_words = UserSaved.query.filter_by(user_id=user_id).all()
    saved_words_info = []

    for user_word in user_words:
        foreign_term = ForeignTerm.query.get(user_word.foreign_id)
        translations = [translation.english_term for translation in foreign_term.english_translations]
        saved_words_info.append({
            "foreign_id": foreign_term.foreign_id,
            "foreign_word": foreign_term.term,
            "english_translations": translations,
        })

    return jsonify(saved_words_info)

    

def save_user_word(token):
    data = request.get_json()
    user_id = User.query.filter_by(token=token).first().id
    foreign_word = data.get('foreign_word')
    
    if not foreign_word:
        return jsonify({"error": "Foreign word is required"}), 400
    
    # Check if the foreign word exists in the ForeignTerm table
    foreign_term = ForeignTerm.query.filter(func.lower(ForeignTerm.term) == func.lower(foreign_word)).first()
    
    # If not, create a new ForeignTerm entry
    if not foreign_term:
        language = Language.query.first()  # Assumes default language; adjust as needed
        if not language:
            return jsonify({"error": "Default language not found"}), 500
        foreign_term = ForeignTerm(language_id=language.language_id, term=foreign_word)
        db.session.add(foreign_term)
        db.session.commit()

    # Check if the term is already saved for this user
    existing_user_saved = UserSaved.query.filter_by(user_id=user_id, foreign_id=foreign_term.foreign_id).first()
    if existing_user_saved:
        return jsonify({"message": "Word already saved"}), 409

    # Save the new word for the user
    new_user_saved = UserSaved(user_id=user_id, foreign_id=foreign_term.foreign_id)
    db.session.add(new_user_saved)
    db.session.commit()

    return jsonify({"message": "Word saved successfully"}), 201