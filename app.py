import json
import os
try:
   from flask import Flask, render_template, redirect, request, abort, session, url_for
   import csv
   import psycopg2
   import requests
   import datetime
except ImportError:
    os.system('pip install flask')
    os.system('pip install django')
    os.system('pip install psycopg2')
    os.system('pip install requests')
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
app.templates_auto_reload = True
global uservisit
uservisit = 0
# with open('books.csv') as csvfile:
#     readCSV = csv.reader(csvfile)
#     for rows in readCSV:
#         if rows[0]!="isbn":
#            test.append(rows)

@app.route('/')
def hello_world():
    print(test[0])
    return redirect("/books")


@app.route('/books')
@app.route('/books/<string:name>')
def book_index(name=''):
    global uservisit
    if name == '':        
        uservisit = 0
        return render_template("index.html")
    if "login" in name:
        uservisit = 0
        return render_template(f"{name}")
    if "Search" in name:
        uservisit+=1
        return render_template(f"{name}",tests=test,isUserVisited=uservisit > 1)
    if "details" in name:
        value=request.args.get('value')
        res = requests.get("https://www.goodreads.com/book/review_counts.json",
                        params={"key": "Yo1A6BgkiRzw3D3U1RFw", "isbns": str(value)})
        result=res.json()
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        cur = conn.cursor()
        cur.execute(" select count(*) from comments where userid =(select id from users where username='"+session['username']+"')and bookid = (select id from books where isbn = '"+value+"');")
        commentavailable = cur.fetchall()
        if (commentavailable[0][0]>0):
            commentavailable=False
        else:
            commentavailable=True
        cur.execute("select u.username ,c.comments,c.rating, c.createddate from users as u , comments as c where c.bookid = (select id from books where isbn='"+value+"') and u.id = c.userid;")
        comments=cur.fetchall()
        cur.execute("select comments from comments where userid = (select id from users where username like '%"+session['username']+"%') and bookid = (select id from books where isbn= '"+value+"');")
        usercomments =cur.fetchall();
        cur.close()
        conn.close()
        for t in test:
            if t[1]==value:
                book=t
                break      
        comments = [(comments[i][0],comments[i][1],comments[i][2],str(datetime.datetime.strftime(datetime.datetime.strptime(str(comments[i][3]), '%Y-%m-%d %H:%M:%S.%f'), "%b %d %Y %H:%M:%S"))) for i in range(0,len(comments))]
        return render_template(f"{name}", value=value,test=book,rating=result["books"][0]["average_rating"],image="http://covers.openlibrary.org/b/isbn/"+str(value)+"-M.jpg",commentboxshow=commentavailable, comments=comments,isusercommentedbefore=len(usercomments) > 0 )
    return render_template(f"{name}")

@app.route('/books/register',methods=["POST"])
def register():
    print(request.form["username"])
    if request.form["username"]!="" and request.form['password']!="" and request.form["confirmpassword"]!="":
        try:
            conn = psycopg2.connect(DATABASE_URL, sslmode='require')
            cur = conn.cursor()
            cur.execute("insert into users (username,password) values ('"+request.form["username"]+"','"+request.form['password']+"');")
            conn.commit()
            cur.close()
            conn.close()
        except:
            return json.dumps({'error':"database error or user already exists please try again"}), 500, {'ContentType':'json'}
        return json.dumps({'success':"success test"}), 200, {'ContentType':'json'}
    else:
        return json.dumps({'error':"please fill all the fields"}), 500, {'ContentType':'json'}

@app.route('/books/signin',methods=["POST"])
def signin():

    if request.form["username"]!="" and request.form['password']!="":
        try:
            print("select count(*) from users where username='"+request.form["username"]+"' and password='"+request.form['password']+"';")
            conn = psycopg2.connect(DATABASE_URL, sslmode='require')
            cur = conn.cursor()
            cur.execute("select count(*) from users where username='"+request.form["username"]+"' and password='"+request.form['password']+"';")
            data =cur.fetchall()
            cur.close()
            conn.close()
        except:
            return json.dumps({'error':"database error"}), 400, {'ContentType':'json'}
        if data[0][0] > 0 :
            session['username'] = request.form["username"]
            session['password'] = request.form['password']
            return json.dumps({'success':"success test"}), 200, {'ContentType':'json'}
        else:
            return json.dumps({'error': "please register"}), 400, {'ContentType': 'json'}
    else:
        return json.dumps({'error':"please fill all the fields"}), 400, {'ContentType':'json'}

@app.route('/api/<isbn>')
def apicall(isbn):
    try:
        res = requests.get("https://www.goodreads.com/book/review_counts.json",
                       params={"key": "Yo1A6BgkiRzw3D3U1RFw", "isbns": isbn})
        result = res.json()
        print(result)
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
        isbn=request.form['isbn']
        isbn=(isbn.split(":")[1]).strip()
        cur.execute("select id from books where isbn='"+isbn+"';")
        bookid=cur.fetchall()
        todaydate = datetime.datetime.today()
        cur.execute("insert into comments (userid,bookid,comments,rating,createddate) values ("+str(userid[0][0])+","+str(bookid[0][0])+",'"+request.form['comment']+"',"+str(request.form['rating'])+",'"+str(todaydate)+"');")
        conn.commit()
        cur.close()
        conn.close()
        return json.dumps({'success':"success test"}), 200, {'ContentType':'application/json'}
    except Exception as e:
        print(str(e))
        return json.dumps({'error': "database error"}), 400, {'ContentType': 'application/json'}

@app.route('/books/logout')
def logout():
    session.pop('username',None)
    session.pop('password',None)
    session.clear()
    return redirect('/books/index.html')
