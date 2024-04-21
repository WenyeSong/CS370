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

class UserContributions(db.Model):
    __tablename__ = 'user_contributions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    foreign_word = db.Column(db.String(255), nullable=False)
    english_translation = db.Column(db.String(255), nullable=False)

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


def delete_user_saved_word(token, foreign_id):
    try:
        user_id = User.query.filter_by(token=token).first().id
        
        user_word = UserSaved.query.filter_by(user_id=user_id, foreign_id=foreign_id).first()
        if user_word:
            db.session.delete(user_word)
            db.session.commit()
            return jsonify({'message': 'Word deleted successfully'}), 200

        return jsonify({'message': 'Word not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


def delete_user_contribution(token, contribution_id):
    try:
        user_id = User.query.filter_by(token=token).first().id
        
        user_contribution = UserContributions.query.filter_by(user_id=user_id, id=contribution_id).first()
        if user_contribution:
            db.session.delete(user_contribution)
            db.session.commit()
            return jsonify({'message': 'Contribution deleted successfully'}), 200

        return jsonify({'message': 'Contribution not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500  

def get_user_words(token):
    user_id = User.query.filter_by(token=token).first().id
    
    saved_words_info = []
    
    # Fetch words from UserSaved
    user_words = UserSaved.query.filter_by(user_id=user_id).all()
    for user_word in user_words:
        foreign_term = ForeignTerm.query.get(user_word.foreign_id)
        if foreign_term:  # Ensure the foreign term exists
            translations = [translation.english_term for translation in foreign_term.english_translations]
            saved_words_info.append({
                "type": "dictionary",  # Indicate this word is from the main dictionary
                "foreign_id": foreign_term.foreign_id,
                "foreign_word": foreign_term.term,
                "english_translations": translations,
            })

    # Fetch contributions from UserContributions
    user_contributions = UserContributions.query.filter_by(user_id=user_id).all()
    for contribution in user_contributions:
        # Here, ensure consistency with how you handle identifiers
        saved_words_info.append({
            "type": "contribution",  # Indicate this word is a user contribution
            "foreign_id": contribution.id,  # Use the primary key ID as the unique identifier
            "foreign_word": contribution.foreign_word,
            "english_translations": [contribution.english_translation],
        })

    return jsonify(saved_words_info)


    

def save_user_word(token):
    data = request.get_json()
    user_id = User.query.filter_by(token=token).first().id
    foreign_word = data.get('foreign_word')
    english_translation = data.get('english_translation')  # Capture English translation from the request
    
    if not foreign_word:
        return jsonify({"error": "Foreign word is required"}), 400
    
    # Check if the foreign word exists in the ForeignTerm table
    foreign_term = ForeignTerm.query.filter(func.lower(ForeignTerm.term) == func.lower(foreign_word)).first()
    
    if foreign_term:
        # If the word exists, check if it's already saved for this user
        existing_user_saved = UserSaved.query.filter_by(user_id=user_id, foreign_id=foreign_term.foreign_id).first()
        if existing_user_saved:
            return jsonify({"message": "Word already saved"}), 409

        # Save the existing word for the user
        new_user_saved = UserSaved(user_id=user_id, foreign_id=foreign_term.foreign_id)
        db.session.add(new_user_saved)
        db.session.commit()

    else:
        # If the word does not exist in the predefined dictionary
        # and an English translation is provided, save it as a user contribution
        if english_translation:
            new_contribution = UserContributions(
                user_id=user_id, 
                foreign_word=foreign_word, 
                english_translation=english_translation
            )
            db.session.add(new_contribution)
            db.session.commit()
            return jsonify({"message": "Your contribution has been saved successfully."}), 201
        else:
            return jsonify({"error": "English translation is required for words not in the dictionary"}), 400

    return jsonify({"message": "Word saved successfully"}), 201

def search_similar(word):
    foreign_terms = ForeignTerm.query.filter(ForeignTerm.term.ilike(f'{word}%')).all()
    foreign_terms = foreign_terms[:5]  # Limit the number of results to 5
    print(foreign_terms)
    return jsonify([term.term for term in foreign_terms]), 200
    
    return jsonify({"message": "This is a placeholder response"}), 200

