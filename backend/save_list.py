from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from db import db, User, Language, ForeignTerm, EnglishTranslation, UserSaved, UserContributions



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
            translations = [translation.english_term for translation in foreign_term.translations]
            # change to "translation.english_explanation" to see the entire definition ! 
            saved_words_info.append({
                "type": "dictionary",  # Indicate this word is from the main dictionary
                "foreign_id": foreign_term.foreign_id,
                "foreign_word": foreign_term.term,
                "english_translations": translations,
                "language_id": foreign_term.language_id # add this for different language tab!
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
            "language_id": contribution.language_id
        })

    return jsonify(saved_words_info)


    

def save_user_word(token):
    data = request.get_json()
    user_id = User.query.filter_by(token=token).first().id
    foreign_word = data.get('foreign_word')
    english_translation = data.get('english_translation')  # Capture English translation from the request
    language_id = data.get('language_id')  # Retrieve the language_id from the request data

    if not foreign_word or not language_id:
        return jsonify({"error": "Foreign word and language ID are required"}), 400
    
    # Verify if the provided language_id exists in the Language table
    if not Language.query.get(language_id):
        return jsonify({"error": "Invalid language ID"}), 400

    # Check if the foreign word exists in the ForeignTerm table
    foreign_term = ForeignTerm.query.filter(ForeignTerm.language_id == language_id).filter(func.lower(ForeignTerm.term) == func.lower(foreign_word)).first()
    if foreign_term:
        print("foreign term exists")
    
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
                english_translation=english_translation,
                language_id=language_id  # Include the language_id in the new contribution
            )
            db.session.add(new_contribution)
            db.session.commit()
            return jsonify({"message": "Your contribution has been saved successfully."}), 201
        else:
            return jsonify({"error": "English translation and language ID are required for words not in the dictionary"}), 400

    return jsonify({"message": "Word saved successfully"}), 201


def search_similar(word,language_id):
    foreign_terms = ForeignTerm.query.filter(ForeignTerm.language_id == language_id).filter(ForeignTerm.term.ilike(f'{word}%')).all()
    foreign_terms = foreign_terms[:5]  # Limit the number of results to 5
    print(foreign_terms)
    return jsonify([term.term for term in foreign_terms]), 200
    
    return jsonify({"message": "This is a placeholder response"}), 200

