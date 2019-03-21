import os
try:
   from flask import Flask,render_template
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
    if name == '':
        return render_template("index.html")
    return render_template(f"{name}")

