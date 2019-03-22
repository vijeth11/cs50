import os
try:
   from flask import Flask,render_template,redirect,request
   import csv
   import psycopg2
except ImportError:
    os.system('pip3 install flask')
    os.system('pip3 install django')
    os.system('pip3 install psycopg2-binary')
    from flask import Flask, render_template, redirect, request
    import csv
    import psycopg2

DATABASE_URL = "postgres://kvodqjxngtsgpt:3f8bc0ed76c932265edff00946122e5386ad95fc7553ba5a7cdeb19c453a65da@ec2-54-246-92-116.eu-west-1.compute.amazonaws.com:5432/d2e8i4j1a7bhqu"
conn = psycopg2.connect(DATABASE_URL, sslmode='require')
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
    cur = conn.cursor()



    if name == '':
        return render_template("index.html")
    if "Search" in name:
        #data = cur.execute("select * from books")
        #print(data)
        return render_template(f"{name}",tests=test)
    if "details" in name:
        value=request.args.get('value')
        for t in test:
            if t[0]==value:
                book=t
                break
        return render_template(f"{name}", value=value,test=book)
    return render_template(f"{name}")

