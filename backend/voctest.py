from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from db import db, User, Language, ForeignTerm, EnglishTranslation


# async function getrandom(language_id) {
#   const response = await fetch(`http://localhost:5000/user/words/${language_id}`, {method: 'GET'});
#   let data = await response.json();
#   console.log(data);
# }

def get_random_words(language_id=0):
    num_words = 3
    if language_id == 0:
        return jsonify({'message': 'Please provide a language id'}), 400
    else:
        words = ForeignTerm.query.filter_by(language_id=language_id).order_by(func.random()).limit(num_words).all()
        if words:
            return jsonify([word.term for word in words]), 200
        return jsonify({'message': 'No words found'}), 404
   