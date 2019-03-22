import os
try:
   from flask import Flask,render_template,redirect,request
   import csv
except ImportError:
    os.system('pip3 install flask')
    os.system('pip3 install django')
app = Flask(__name__)

test=[]
with open('books.csv') as csvfile:
    readCSV = csv.reader(csvfile)
    for rows in readCSV:
        if rows[0]!="isbn":
           test.append(rows)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/david')
def david():
    return "hell david"


@app.route('/books')
@app.route('/books/<string:name>')
def book_index(name=''):
    print(name);


    if name == '':
        return render_template("index.html")
    if "Search" in name:
        return render_template(f"{name}",tests=test)
    if "details" in name:
        value=request.args.get('value')
        for t in test:
            if t[0]==value:
                book=t
                break
        return render_template(f"{name}", value=value,test=book)
    return render_template(f"{name}")

