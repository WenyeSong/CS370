import pyttsx3

# Initialize the pyttsx3 engine
engine = pyttsx3.init()

# Find available voices and select a German voice
voices = engine.getProperty('voices')
language_list=["chinese","english","japanese"]
language = "english"
voice = next((voice for voice in voices if language in voice.name.lower()), None)


if voice:
    engine.setProperty('voice', voice.id)
    print(f"Using voice '{voice.name}' for language '{language}'.")
else:
    print("No language found, using default voice.")

word_list = ["Hello, this is a demonstration of text to speech conversion."]

for word in word_list:
    output_file = f"{language}_{word}.mp3"
    
    engine.save_to_file(word, output_file)
    
    engine.runAndWait()
    
    print(f"Saved '{word}' to '{output_file}'.")
