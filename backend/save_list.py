from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

# In-memory storage for simplicity
words_list = [
    {"word": "meticulous", "definition": "Showing great attention to detail; very careful and precise."},
    {"word": "vivacious", "definition": "Attractively lively and animated."},
    {"word": "serendipity", "definition": "The occurrence and development of events by chance in a happy or beneficial way."},
    {"word": "ephemeral", "definition": "Lasting for a very short time."},
    {"word": "quintessential", "definition": "Representing the most perfect or typical example of a quality or class."},
    {"word": "melancholy", "definition": "A feeling of pensive sadness, typically with no obvious cause."},
    {"word": "ineffable", "definition": "Too great or extreme to be expressed or described in words."},
    {"word": "lucid", "definition": "Expressed clearly; easy to understand."},
    {"word": "ubiquitous", "definition": "Present, appearing, or found everywhere."},
    {"word": "zenith", "definition": "The time at which something is most powerful or successful."}
]



@app.route('/words/<int:index>', methods=['DELETE'])
def delete_word(index):
    if index < len(words_list):
        del words_list[index]
        return jsonify({"message": "Word deleted successfully!"}), 200
    else:
        return jsonify({"error": "Word not found"}), 404
    

@app.route('/words', methods=['GET'])
def get_words():
    return jsonify(words_list)

@app.route('/words', methods=['POST'])
def add_word():
    data = request.json
    words_list.append(data)
    return jsonify({"message": "Word added successfully!"}), 201


if __name__ == "__main__":
    app.run(debug=True)
