User Documentation
0. Link to our web app
Click Here and Study Fun!

1. Register and Login
Welcome to Vocab Grow!  Your first step is to create your own account.
Click on the 'Register' link on the homepage or select the 'Register' button in the upper right corner of the navigation bar.
Enter your account name, a valid email address, and a secure password in the fields. 
After filling out the fields, click the 'Sign Up' button to submit your registration details. You will be navigated to the main page automatically.
login
Enter your registered username and password to log in. 

2. Flashcard Function
Welcome to the Flashcard Function! This function allows you to generate flashcards for language-learning purposes.
Getting Started
Navigate to the Flashcard page from the main menu.
Select a language from the dropdown menu.
Optionally, select a difficulty level.
Enter the number of flashcards you want to generate.
Click on the "Generate" button to create your flashcards.
Viewing Flashcards
Once generated, you can see the flashcards displayed on the screen.
Use the navigation buttons (← and →) to move between flashcards.
Adding Words
Each flashcard has an "Add Word" button.
Click on the "Add Word" button to add the word and its translation to your vocabulary list.
Note:
Make sure you're logged in to save words to your vocabulary list.
Words are added to the vocabulary list associated with the selected language.


3. Vocabulary Test Page
Welcome to the Vocabulary Test Page! This page allows you to take vocabulary tests in two different formats: Fill in the Blank and Multiple Choice.
Getting Started
Navigate to the Vocabulary Test page from the main menu.
Click on either the "Fill in the Blank" button or the "Multiple Choice" button to start the respective test.


Taking the Test
Choose the desired test format by clicking on the corresponding button.
Each test format will lead you to a different page where you can answer the questions.
Follow the instructions provided on each test page to complete the test.
Navigation
Use the navigation bar at the top of the page to navigate to other sections of the application.


4. Saved Word List
This place customizes vocabulary lists for each user! Once registered, each user will be assigned a blank saved word list. Users can save the foreign terms they want to practice/remember into this list. By switching between four language tabs, users can switch between French, Spanish, Dutch, and German modes. 
When adding words to the vocabulary list:
Getting Started
If you don’t know how to get started, try flashcards first! Every new user will be directed to the flash card page. You can also find “FLASHCARD” in the navigation bar. View flashcards and add interested terms to the saved word list.

Having a specific word in mind? 
Use the “Add New Word” function in the Saved Words List:
Spell the foreign term in the first box and click the “Add New Word” function.
If the foreign term is present in our database dictionary, you don’t need to fill in the “English Translation” box, we will automatically show the definition.


Adding a foreign term but forgetting it’s spelling?
We got you! If the foreign term is included in the database dictionary, the spelling check will guide you through the spelling!
Want to save a word that’s not found in the dictionary?
If the foreign term is not found in the database dictionary, the user can still include the term in the list, by spelling out the term in the “Type a Foreign Word” box, and customize its definition in “English Translation”. Click the “Add New Word” button to save. 
Note:
Usually, there’s no duplicated words in the saved word list. But for customized words (words not in dictionary), users can save repeated foreign terms, thus enabling them to separately memorize different meanings of a word.


























Technical Documentation

Part 1: frontend
We use React as our framework of the frontend.

flashcard
Architecture Diagram
library(DiagrammeR)
mermaid("
graph TD;
 A[FlashcardPage] -->|useState| B[FlashcardList];
 A -->|useState| C[Navbar];
 A -->|useState| D[Flashcard];
 A -->|useState| E[Form];
 A -->|useState| F[Button];
 A -->|useState| G[useNavigate];
 A -->|useState| H[config];
 A -->|useState| I[useEffect];
 A -->|useState| J[fetchDictionaries];
 J -->|useState| K[fetch];
 J -->|useState| L[dictionaryToLanguageId];
 J -->|useState| M[fetchedDictionaries];
 J -->|useState| N[setDictionaries];
 A -->|useState| O[hasDifficultyLevels];
 A -->|useState| P[addWord];
 A -->|useState| Q[handleSubmit];
 B -->|useState| R[Flashcard];
 B -->|useState| S[goToPreviousFlashcard];
 B -->|useState| T[goToNextFlashcard];
")
Major Components
FlashcardPage: React component responsible for rendering the flashcard page UI. Manages state for flashcards, selected dictionary, dictionaries, language ID, success message, and difficulty level.
FlashcardList: React component responsible for rendering the list of flashcards. Receives flashcards data and handles navigation between flashcards.
Navbar: React component responsible for rendering the navigation bar.
Flashcard: React component responsible for rendering individual flashcards. Handles flipping animation and adding words to the vocabulary list.
Form and Button: Ant Design components used for styling the form and button elements.
useNavigate: React Router hook for programmatic navigation.
config: Configuration file containing server IP.
useEffect: React hook for managing side effects like data fetching.
fetchDictionaries: Function to fetch language dictionaries from external sources.
hasDifficultyLevels: Function to determine if a language has difficulty levels.
addWord: Function to add a word and its translation to the vocabulary list.
handleSubmit: Function to handle form submission and generate flashcards.
Code Organization
The code is organized into functional components based on their responsibilities.
State management is handled using React hooks like useState and useEffect.
External API calls are made using the fetch API.
Modular functions are used for specific tasks like adding words and fetching dictionaries.
Page Layout
The page layout is structured using HTML elements and styled with CSS classes.
.flashcard-form-container: input box for number of questions and the language selection button
.card: determines the content format of each flashcard and the flipping animation
Vocab test
Architecture Diagram
mermaid("
graph TD;
graph TD;
    A[Voctest] -->|useState| B[useNavigate];
    A -->|useState| C[Navbar];
")

Major Components
Voctest: React component responsible for rendering the vocabulary test page UI. Contains buttons to navigate to the Fill in the Blank and Multiple Choice test pages.
Navbar: React component responsible for rendering the navigation bar.
Code Organization
The code is organized into functional components for clarity and modularity.
React Router's useNavigate hook is used to enable programmatic navigation.
The handleFillInBlankClick and handleMultipleChoiceClick functions handle navigation to the respective test pages.
The page layout is structured using HTML elements and styled with CSS classes.
Page Layout
.Voc_test: decides the overall layout of the entire page, including the arrangement of the background image and sub-elements
.App-header: handles the header that contains the main title and the two buttons; it makes sure that all elements are located at the center of the header; the size of the header will readjust itself when new contents of questions are loaded into the page
.question and .answer, and .input: handles the font and position of each question and answer (multiple choice buttons and fill-in-the-blank input boxes). 


Saved Word List
Architecture Diagram
mermaid("
graph TD;
    A[Flask Application] -->|Defines Models| B[Database Models];
    A -->|Handles Requests| C[Endpoint Handlers];
    B -->|Connects to| D[SQLite Database];
    
    C -->|delete_user_saved_word| E[DELETE /user/words/:id];
    C -->|delete_user_contribution| F[DELETE /user/contributions/:id];
    C -->|get_user_words| G[GET /user/words];
    C -->|save_user_word| H[POST /user/words];
    C -->|search similar| I[GET /user/words/search];

    E -.->|DELETE Request| K[SavedList Component];
    F -.->|DELETE Request| K;
    G -.->|GET Request| K;
    H -.->|POST Request| K;
    I -.->|GET Request| L[VocabTest Multiple Choice Component];
")
Major Components 
SavedList:
This main component is responsible for displaying the user's saved words and handling interactions. It uses fetchWords() to populate the list of words, invoking get_user_words from the backend. It handles adding new words and deleting existing ones by making POST and DELETE requests to the respective backend endpoints.
SearchBar:
Enhances the user input experience by providing autocomplete functionality. It interacts with the search_similar backend function to fetch and display suggestions based on the user's input.
Table:
Renders a list of words along with options to delete or edit. Each deletion triggers a call to either delete_user_saved_word or delete_user_contribution, depending on the type of word (saved or contributed).
Tabs:
Facilitates filtering of words by language. Each tab corresponds to a specific language. Clicking a tab triggers the fetchWords function, which adjusts the displayed data by making a filtered request to the backend.
Page Layout
Saved word list page uses Ant Design (antd) elements to help organize the page layout. The styles of card, form, button, etc. are written in the .js files. 

Navigation Bar
Major Components
hellouser: when logged in, retrieve the name of the user and return a bullet point of user greeting 
contains a list of bullet points that help the user traverse to every page on the website. It uses Link feature from react-router-dom to handle routing in the section. 
Navbar is called in the aforementioned three pages (flashcard, vocab test, and saved word list). Register and login pages have their independent navigation bars. 
Page Layout
.container: overall structure of the sub-elements in the navigation bar.
.navhead: the style of the header, including the size of the navigation bar
nav: the alignment of buttons in the nav element. This includes styles of buttons, space between buttons, and the arrangement of button list. 




Part 2: Backend & Database

We use Flask as our framework of the backend, and PostgreSQL as our database.
Database Models (db.py)
User: Handles user information including username and authentication tokens.
Language: Manages different languages available in the system.
ForeignTerm: Contains foreign words and their relationships to languages.
EnglishTranslation: Stores English translations of foreign terms.
UserSaved: Links users with their saved foreign words.
UserContributions: Manages words contributed by users, including translations.
Note: I built the UserContributions table to store self-defined foreign terms added by users, in order to prevent the customized entries from altering the original dictionary.


Database Schema(db.py)
Also present in the backend, db.py:

Storing the registered user information. 
-- User Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    token VARCHAR(80) NOT NULL UNIQUE
);

Storing the number id of each supported language, for example, language_name as French, and language_id as 1.
-- Language Table
CREATE TABLE languages (
    language_id INTEGER PRIMARY KEY,
    language_name VARCHAR(255) NOT NULL
);

Storing every foreign term in four dictionaries.
-- Foreign Term Table
CREATE TABLE foreign_table1 (
    foreign_id INTEGER PRIMARY KEY,
    language_id INTEGER NOT NULL,
    term VARCHAR(255) NOT NULL,
    FOREIGN KEY (language_id) REFERENCES languages(language_id)
);

Storing all English translations for every foreign term.
-- English Translation Table
CREATE TABLE translations (
    translation_id INTEGER PRIMARY KEY,
    foreign_language_id INTEGER NOT NULL,
    english_id INTEGER,
    english_term VARCHAR(255) NOT NULL,
    english_explanation TEXT,
    FOREIGN KEY (foreign_language_id) REFERENCES foreign_table1(foreign_id)
);

Storing saved word list information for every user.
-- User Saved Table
CREATE TABLE user_saved (
    user_id INTEGER,
    foreign_id INTEGER,
    PRIMARY KEY (user_id, foreign_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (foreign_id) REFERENCES foreign_table1(foreign_id)
);

Storing the self-defined word from every user (when the user wishes to customize the english definition of a foreign term that is not found in our dictionary).
-- User Contributions Table
CREATE TABLE user_contributions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    foreign_word VARCHAR(255) NOT NULL,
    english_translation VARCHAR(255) NOT NULL,
    language_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (language_id) REFERENCES languages(language_id)
);
Endpoint Handlers 
1. login.py 
login_routes(app):
‘’/api/health‘’ send GET request to check if the backend server is running.
‘’/api/login‘’ send POST request to authenticate users. The endpoint checks the username and password against the database entries.
2.register.py
register_routes(app)
 “/api/register” sends POST requests containing username, email, and password. This validates the data and inserts a new user record into the database.
3.save_list.py
delete_user_saved_word(token, foreign_id):
Triggered from the frontend when a user opts to delete a saved word. The frontend sends a DELETE request with the user's token and the foreign ID of the word to be deleted. Backend validates the user and the word, deletes it if found, and responds with a success or error message.
delete_user_contribution(token, contribution_id):
Similar to deleting a saved word, but it targets user-contributed translations. The frontend initiates this via a DELETE request with the necessary IDs. The backend removes the contribution and provides appropriate feedback through JSON responses.
get_user_words(token):
This function is automatically called when the frontend loads the user's saved and contributed words. It sends a GET request, the backend fetches all relevant entries for the user, and returns them in an organized JSON format.
save_user_word(token):
This POST request is made when a user saves a new word or contribution from the frontend. The frontend sends the foreign word, its English translation, and language ID, which the backend processes to either add a new entry or update an existing one.
search_similar(word, language_id):
Supports the frontend's autocomplete feature by providing similar words as the user types.A GET request fetches words that start with the typed letters in a specified language, enhancing user experience by quickly presenting potential matches.


4. dic_input_revised.py
get_language_id: 
Retrieves the language ID from the database based on the provided language name.
get_max_translation_id:
 Retrieves the maximum translation ID from the database.
The insert_data_from_json:
Reads data from a JSON file specified by json_file_path, connects to the PostgreSQL database using psycopg2, and iterates through the data in the JSON file.


Part 3: Dictionary
Every file in the dictionary_crawl has three programs that can generate the version accepted by the database.
filter_word_languageName.py:
Filtering French Words: It defines a function is_french_word to check if a given word consists of characters typically found in different languages. 
Saving Filtered Data: It saves the filtered dataframe to a new text file
languageName_crawl.py:
get_word_data function: Takes a word as input and constructs the URL for the Cambridge Dictionary page of that word. Sends a GET request to the URL using requests. Parses the HTML content of the response using BeautifulSoup. Check if the word exists on the page. Extracts the real-word definitions from the page and returns them as a dictionary with the word and its definitions.
crawl_words function: Takes a list of words as input. Initializes a thread pool with a maximum of 4 workers using ThreadPoolExecutor. Submits tasks to the thread pool to scrape word data asynchronously. Sleeps for a random duration (between 0.2 and 0.4 seconds) before each request to avoid overwhelming the server. Collects the results from the completed tasks and handles any errors that occur during scraping.
Main Script: Reads a list of words from an input txt file. Calls the crawl_words function to scrape data for the words. Writes the results to an output JSON file.


final_version_languageName.py:
modify_json function: Iterates through each entry in the JSON data.Sets the language ID for each entry to a different language ID according to the backend table. Splits each "real_word" into two parts: the word itself and its explanation (if available). Appends the word part to a new list new_real_word and the explanation part (or a default explanation if not available) to another list explanations. Updates the "real_word" field with the split words and the "explanation" field with the corresponding explanations.

Part 4: Deployment
We manage server IPs using a unified config file and host our server on an AWS EC2 instance. Our Flask application is deployed using Nginx, enhancing performance and reliability. Both frontend and backend components are containerized using Docker, facilitating consistent operations across different environments. Docker images are built from Dockerfiles that define all necessary dependencies and configurations, ensuring seamless deployment and scalability.

Contributing Guidelines
Thank you for considering contributing to our VocabGrow! To contribute:
Clone the repository to your local machine.
Install dependencies using npm install.
Make changes or add new features.
Test your changes thoroughly.
Submit a pull request with a clear description of your changes.











