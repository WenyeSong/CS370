from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for simplicity
words_list = [
    {"word": "meticulous", "definition": "Showing great attention to detail; very careful and precise."},
    {"word": "vivacious", "definition": "Attractively lively and animated."},
    # Add the initial words from your frontend here
]

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
