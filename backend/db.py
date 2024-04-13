from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'  # Explicitly specify the table name to match your database
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    token = db.Column(db.String(80),unique=True, nullable=False)
    # Other fields...

class Language(db.Model):
    __tablename__ = 'languages'
    language_id = db.Column(db.Integer, primary_key=True)
    language_name = db.Column(db.String(255), nullable=False)

class ForeignTerm(db.Model):
    __tablename__ = 'foreign_terms'
    foreign_id = db.Column(db.Integer, primary_key=True)
    language_id = db.Column(db.Integer, db.ForeignKey('languages.language_id'), nullable=False)
    term = db.Column(db.String(255), nullable=False)
    english_translations = db.relationship('EnglishTranslation', backref='foreign_term', lazy='dynamic')

class EnglishTranslation(db.Model):
    __tablename__ = 'english_translations'
    translation_id = db.Column(db.Integer, primary_key=True)
    foreign_id = db.Column(db.Integer, db.ForeignKey('foreign_terms.foreign_id'), nullable=False)
    english_id = db.Column(db.Integer)  # Assuming this relates to a language ID for English, might require adjustment
    english_term = db.Column(db.String(255), nullable=False)

class UserSaved(db.Model):
    __tablename__ = 'user_saved'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)  # Corrected ForeignKey reference
    foreign_id = db.Column(db.Integer, db.ForeignKey('foreign_terms.foreign_id'), primary_key=True)