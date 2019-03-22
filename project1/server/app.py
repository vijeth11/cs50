import os
try:
   from flask import Flask,render_template,redirect,request
except ImportError:
    os.system('pip3 install flask')
    os.system('pip3 install django')
app = Flask(__name__)


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
    test=[["Otto","hello","world","1234"],["second","value","test","1235"]]
    if name == '':
        return render_template("index.html")
    if "Search" in name:
        return render_template(f"{name}",tests=test)
    if "details" in name:
        value=request.args.get('value')
        return render_template(f"{name}", value=value)
    return render_template(f"{name}")

