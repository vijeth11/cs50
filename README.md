# Project 1

Created a website called bibilo etheca which is an online library where users can add their ratings and comments.

### To run in local system:
    1. clone the repository
    2. point the path to server folder in command promt and run flask run --reload for development or flask run for prod or python app.py        --relodad
### File structure
    server
      |_ _ static
      |      |_ _ images // consists of all images used in the website
      |      |_ _ scripts // consits of login.js file used to handle login page  
      |      |_ _ stylesheet //consits of all css files used in webpage
      |_ _ templates // consists of all html files
      |_ _ app.py //flask start file
      |_ _ import.py //inital file to insert all data from books.csv to database
      |_ _ books.csv //excel sheet with information about books
