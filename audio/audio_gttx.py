from gtts import gTTS
import os


text_to_say = "Hello, this is a demonstration of text to speech conversion."

# Choosing the language, English in this case
language = 'en'

# Passing the text and language to the engine, 
# here we also mark slow=False which tells the
# module that the converted audio should 
# have a high speed
myobj = gTTS(text=text_to_say, lang=language, slow=False)

# Saving the converted audio in a mp3 file named
# 'welcome.mp3'
myobj.save("welcome.mp3")

