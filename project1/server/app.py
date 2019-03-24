import json
import os
try:
   from flask import Flask, render_template, redirect, request, abort, session, url_for
   import csv
   import psycopg2
   import requests
except ImportError:
    os.system('pip3 install flask')
    os.system('pip3 install django')
    os.system('pip3 install psycopg2-binary')
    os.system('pip3 install requests')
    from flask import Flask, render_template, redirect, request,abort,session,url_for
    import csv
    import psycopg2
    import requests

DATABASE_URL = "postgres://kvodqjxngtsgpt:3f8bc0ed76c932265edff00946122e5386ad95fc7553ba5a7cdeb19c453a65da@ec2-54-246-92-116.eu-west-1.compute.amazonaws.com:5432/d2e8i4j1a7bhqu"
conn = psycopg2.connect(DATABASE_URL, sslmode='require')
cur = conn.cursor()
cur.execute("select * from books")
test=cur.fetchall()
cur.close()
conn.close()
if test==None:
    print("no data found")
else:
    print("data fetched "+str(len(test)))


app = Flask(__name__)
app.secret_key = 'ytsfthjasidjusfhebksl'

# with open('books.csv') as csvfile:
#     readCSV = csv.reader(csvfile)
#     for rows in readCSV:
#         if rows[0]!="isbn":
#            test.append(rows)

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
        res = requests.get("https://www.goodreads.com/book/review_counts.json",
                        params={"key": "Yo1A6BgkiRzw3D3U1RFw", "isbns": str(value)})
        result=res.json()
        for t in test:
            if t[1]==value:
                book=t
                break
        return render_template(f"{name}", value=value,test=book,rating=result["books"][0]["average_rating"],image="http://covers.openlibrary.org/b/isbn/"+str(value)+"-M.jpg" )
    return render_template(f"{name}")

@app.route('/books/register',methods=["POST"])
def register():
    print(request.json["username"])
    if request.json["username"]!="" and request.json['password']!="" and request.json["confirmpassword"]!="":
        try:
            conn = psycopg2.connect(DATABASE_URL, sslmode='require')
            cur = conn.cursor()
            cur.execute("insert into users (username,password) values ('"+request.json["username"]+"','"+request.json['password']+"');")
            conn.commit()
            cur.close()
            conn.close()
        except:
            return json.dumps({'error':"database error or user already exists please try again"}), 400, {'ContentType':'application/json'}
        return json.dumps({'success':"success test"}), 200, {'ContentType':'application/json'}
    else:
        return json.dumps({'error':"please fill all the fields"}), 400, {'ContentType':'application/json'}

@app.route('/books/signin',methods=["POST"])
def signin():

    if request.json["username"]!="" and request.json['password']!="":
        try:
            print("select count(*) from users where username='"+request.json["username"]+"' and password='"+request.json['password']+"';")
            conn = psycopg2.connect(DATABASE_URL, sslmode='require')
            cur = conn.cursor()
            cur.execute("select count(*) from users where username='"+request.json["username"]+"' and password='"+request.json['password']+"';")
            data =cur.fetchall()
            cur.close()
            conn.close()
            print("data "+str(data))
        except:
            return json.dumps({'error':"database error"}), 400, {'ContentType':'application/json'}
        if data[0][0] > 0 :
            session['username'] = request.json["username"]
            session['password'] = request.json['password']
            return json.dumps({'success':"success test"}), 200, {'ContentType':'application/json'}
        else:
            return json.dumps({'error': "please register"}), 400, {'ContentType': 'application/json'}
    else:
        return json.dumps({'error':"please fill all the fields"}), 400, {'ContentType':'application/json'}

@app.route('/api/<isbn>')
def apicall(isbn):
    try:
        res = requests.get("https://www.goodreads.com/book/review_counts.json",
                       params={"key": "Yo1A6BgkiRzw3D3U1RFw", "isbns": isbn})
        result = res.json()
        for t in test:
            if t[1]==isbn:
                book =t
                return json.dumps({ "title": book[2],"author": book[3],"year": book[4],"isbn": book[1],"review_count": result["books"][0]["reviews_count"],"average_score": result["books"][0]["average_rating"]})
    except:
        return json.dumps({'error': "no book found"})
    return json.dumps({'error': "no book found"})


@app.route('/books/comment',methods=["POST"])
def comment():
    try:
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        cur = conn.cursor()
        cur.execute("select id from users where username='"+session['username']+"'and password='"+session['password']+"';")
        userid=cur.fetchall()
        isbn=request.json['isbn']
        isbn=(isbn.split(":")[1]).strip()
        cur.execute("select id from books where isbn='"+isbn+"';")
        bookid=cur.fetchall()
        cur.execute("insert into comments (userid,bookid,comments,rating) values ("+str(userid[0][0])+","+str(bookid[0][0])+",'"+request.json['comment']+"',"+str(request.json['rating'])+");")
        conn.commit()
        cur.close()
        conn.close()
        return json.dumps({'success':"success test"}), 200, {'ContentType':'application/json'}
    except:
        return json.dumps({'error': "database error"}), 400, {'ContentType': 'application/json'}