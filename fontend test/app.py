import json
import os,io
import random
import uuid
import base64
from model import *
try:
    from flask import Flask, render_template, session,request,redirect,url_for,jsonify,send_file
    from flask_socketio import SocketIO,emit,send
    from datetime import datetime
except ImportError:
    os.system('pip install flask')
    os.system('pip install flask-socketio')
    from flask import Flask, render_template, session,request,redirect,url_for
    from flask_socketio import SocketIO,emit,send
    from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.secret_key = "hello"
socketio = SocketIO(app)
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/',methods=["GET","POST"])
def login():    
    if request.method == 'POST':
        if(str(request.form["requestType"]) == "Login"):
            user = Contact.query.filter_by(email=request.form["username"],password=request.form["password"]).first()
            if user is None:
                return "user not found ",401
            session["username"]=user.username
            return user.username,200
        if(str(request.form["requestType"]) == "Register"):
            person = Contact.query.filter(or_(Contact.username==request.form["username"],Contact.email==request.form["email"])).first()
            if person is None:
                try:
                    base64String1 = base64.b64encode(request.files["userProfileImage"].read())
                    person = Contact(username=request.form["username"],password=request.form["password"],email=request.form["email"],userprofileimage=base64String1)
                    db.session.add(person)
                    db.session.commit()
                except:
                    return "some error occured",500
            else:
                return "user already exists please use different name",500
            return request.form['username'],200
    return render_template("login.html")

@app.route('/loggedin/<name>')
def chatApp(name):
    if session.get("username") is None:
        return redirect("/")
    if name is not "undefined":
        loggedinUser =  Contact.query.filter_by(username=name).first()
        if(loggedinUser is not None):
            if len(loggedinUser.userprofileimage) > 0:
                return render_template("index.html",name=name,imagepath="data:image/png;base64,"+loggedinUser.userprofileimage.decode('utf-8'))
            return render_template("index.html",name=name,imagepath="")
        return ""
    return ""

@app.route('/logout')
def logout():
    session.pop("username",None)
    return redirect("/")

@socketio.on('my event')
def handle_my_custom_event(arg1):
    print(arg1['data'])
    loggedinUserContacts=[]
    contactListOfLoggedinUser = ContactList.query.filter_by(person_id=Contact.query.filter_by(username=arg1['name']).first().id).all()
    if len(contactListOfLoggedinUser) > 0:
        for contact in contactListOfLoggedinUser:
            person = Contact.query.filter_by(id=contact.friend_id).first()
            lastMessage = Message.query.filter(or_(and_(Message.senderName == arg1['name'],Message.recieverName==person.username),and_(Message.senderName==person.username,Message.recieverName==arg1['name']))).order_by(desc(Message.sentDate)).first()
            if person.userprofileimage is not None:
                if lastMessage is not None:
                    if lastMessage.senderName == arg1['name']:
                        loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':'you: '+lastMessage.message})
                    else:
                        loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':lastMessage.message})
                else:
                    loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':""})
            else:
                if lastMessage is not None:
                    if lastMessage.senderName == arg1['name']:
                        loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':'you: '+lastMessage.message})
                    else:
                        loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':lastMessage.message})
                else:
                    loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"../static/images/image1.jpg",'lastMessage':""})            
    emit("after connect",{'selectedName':loggedinUserContacts[0]['username'],'name':arg1['name'],'contacts':loggedinUserContacts})

@socketio.on('send-message')
def handle_message(message):
    try:
        if(message["attachment"] is not None):
            storeMessage = Message(senderName=message['sender'],recieverName=message['reciever'],message=message['message'],sentDate=datetime.now())
            messageAttachment = Attachment(filename=message["attachment"]["filename"],filetype=message["attachment"]["filetype"],file=message["attachment"]["file"],message=storeMessage)
            db.session.add(storeMessage)
            db.session.add(messageAttachment)
        else:
            storeMessage = Message(senderName=message['sender'],recieverName=message['reciever'],message=message['message'],sentDate=datetime.now())
            db.session.add(storeMessage)
        db.session.commit()
        message['senderImage'] = "data:image/png;base64,"+Contact.query.filter_by(username=message['sender']).first().userprofileimage.decode('utf-8')
    except:
        emit('message-recieved',{'error':'internal server error'})
    emit('message-recieved',message,broadcast=True)

def addContactsForGivenUser(contacts,person):
    if len(contacts) > 0:
        for contact in contacts:
            if(contact.username!=person.username):
                contactList = ContactList(person_id=person.id,friend_id = contact.id)
                db.session.add(contactList)
                db.session.commit()

@socketio.on('get-message-list')
def getMessageList(request):
    messageList = Message.query.filter(or_(and_(Message.senderName == request['sender'],Message.recieverName==request['reciever']),and_(Message.senderName==request['reciever'],Message.recieverName==request['sender'])))
    messagesInOrder = []
    for message in messageList:
        if(message.senderName==request['sender']):
            if(message.attachment is not None):
                messagesInOrder.append({"type":"right","message":message.message,"attachment":{"file":message.attachment.file,"filename":message.attachment.filename,"filetype":message.attachment.filetype}})
            else:
                messagesInOrder.append({"type":"right","message":message.message})
        else:
            if(message.attachment is not None):
                messagesInOrder.append({"type":"left","message":message.message,"attachment":{"file":message.attachment.file,"filename":message.attachment.filename,"filetype":message.attachment.filetype}})
            else:
                messagesInOrder.append({"type":"left","message":message.message})
    senderImage = "data:image/png;base64,"+Contact.query.filter_by(username=request['sender']).first().userprofileimage.decode('utf-8')
    recieverImage = "data:image/png;base64,"+Contact.query.filter_by(username=request['reciever']).first().userprofileimage.decode('utf-8')
    emit('message-list',{'messages':messagesInOrder,'senderImage':senderImage,'recieverImage':recieverImage})

@socketio.on('get-friends-list')
def getFriendsList(loggedinUser):
    person = Contact.query.filter_by(username=loggedinUser).first()
    newFriends = db.session.query(Contact).filter(Contact.id.notin_(sum(db.session.query(ContactList.friend_id).filter(ContactList.person_id == person.id).all(),()))).all()
    ##newFriends = db.engine.execute("select * from contact where id not in (select friend_id from contact_list where person_id = :val)",{'val':person.id})
    friendsList =[]
    for friend in newFriends:
        friendsList.append({'name':friend.username,'userprofileimage':friend.userprofileimage.decode('utf-8')})
    emit("display friends list",friendsList)

@socketio.on('add-friends-to-user')
def addContactsToUser(data):
    loggedinUserContacts=[]
    print(data)
    try:
            loggedinUser=Contact.query.filter_by(username=data["username"]).first()
            friendsList =[]
            for friend in data["friendsList"]:
                friendsList.append(Contact.query.filter_by(username=friend).first())
            addContactsForGivenUser(friendsList,loggedinUser)
            contactListOfLoggedinUser = ContactList.query.filter_by(person_id=loggedinUser.id).all()
            for contact in contactListOfLoggedinUser:
                person = Contact.query.filter_by(id=contact.friend_id).first()
                if person.userprofileimage is not None:
                    loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8')})
                else:
                    loggedinUserContacts.append({'username':person.username,'id':person.id,'userprofileimage':"../static/images/image1.jpg"})          

    except:
            emit("after connect",{'error':'database error'})
    emit("after connect",{'selectedName':loggedinUserContacts[0]['username'],'name':loggedinUser.username,'contacts':loggedinUserContacts})

if __name__ == '__main__':
    socketio.run(app,debug=True)