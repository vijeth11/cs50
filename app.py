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
    lastmessagedName = ""
    loggedinUserContacts=[]
    loggedinUserGroups = []
    loggedinUser = Contact.query.filter_by(username=arg1['name']).first()    
    loggedinUserContacts = getLoggedinUserContactList(loggedinUser)                  
    loggedinUserGroups = getLoggedinUserGroupList(loggedinUser)
    lastmessage = Message.query.filter(or_(Message.senderName == arg1['name'],Message.recieverName == arg1['name'])).order_by(desc(Message.sentDate)).first()
    if(lastmessage is not None):
        if(lastmessage.senderName == arg1['name']):
            lastmessagedName = lastmessage.recieverName
        else:
            lastmessagedName = lastmessage.senderName
    else:
        lastmessagedName = loggedinUserContacts[0]["name"]
    print(lastmessagedName)
    emit("after connect",{'selectedName':lastmessagedName,'name':arg1['name'],'contacts':loggedinUserContacts,'groups':loggedinUserGroups})

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
        if message['recieverType'] == "contact":
            message['senderImage'] = "data:image/png;base64,"+Contact.query.filter_by(username=message['sender']).first().userprofileimage.decode('utf-8')
        else:
            message['senderImage'] = Group.query.filter_by(name=message['reciever']).first().groupimage
    except Exception as e:
        if hasattr(e,"message"):
            emit('message-recieved',{'error': e.message})
        else:
            emit('message-recieved',{'error': str(e)})
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
    groupdata = db.session.query(Group,Contact,groupmembers).filter(Group.name == request['reciever']).filter(Contact.username == request['sender']).filter(and_(groupmembers.c.groupid == Group.id,groupmembers.c.contactid == Contact.id)).first()
    if groupdata is not None:
        messageList= list(set(list(messageList) + list(Message.query.filter(Message.recieverName == groupdata[0].name))))
        messageList.sort(key = lambda x: x.sentDate)
    #messageList = db.engine.execute("""select DISTINCT * from message where senderName = :sender and recieverName = :reciever or recieverName = :sender and senderName = :reciever 
    #               or  recieverName = (select g.name from [group] as g,contact as c, groupmembers as gm where g.name = :reciever and c.username=:sender and gm.groupid = g.id and gm.contactid = c.id)""",{'sender':request['sender'],'reciever':request['reciever']})
    messagesInOrder = []
    for message in messageList:
        if(message.senderName==request['sender']):
            if(message.attachment is not None):
                messagesInOrder.append({"type":"right","message":message.message,"attachment":{"file":message.attachment.file,"filename":message.attachment.filename,"filetype":message.attachment.filetype}})
            else:
                messagesInOrder.append({"type":"right","message":message.message,"sender":message.senderName})
        else:
            if(message.attachment is not None):
                messagesInOrder.append({"type":"left","message":message.message,"attachment":{"file":message.attachment.file,"filename":message.attachment.filename,"filetype":message.attachment.filetype}})
            else:
                messagesInOrder.append({"type":"left","message":message.message,"sender":message.senderName})
    senderUser = Contact.query.filter_by(username=request['sender']).first()
    if senderUser is not None:
        senderImage = "data:image/png;base64,"+senderUser.userprofileimage.decode('utf-8')
    else:
        senderUser = Group.query.filter_by(name = request['sender']).first()
        if senderUser is not None:
            senderImage = senderUser.groupimage
        else:
            senderImage = "data:image/png;base64,"
    recieverUser = Contact.query.filter_by(username=request['reciever']).first()
    if recieverUser is not None:
        recieverImage = "data:image/png;base64,"+recieverUser.userprofileimage.decode('utf-8')
    else:
        recieverUser = Group.query.filter_by(name = request['reciever']).first()
        if recieverUser is not None:
            recieverImage = recieverUser.groupimage
        else:
            recieverImage = "data:image/png;base64,"
    emit('message-list',{'messages':messagesInOrder,'senderImage':senderImage,'recieverImage':recieverImage})

@socketio.on('get-friends-list')
def getFriendsList(loggedinUser):
    person = Contact.query.filter_by(username=loggedinUser).first()
    newFriends = db.session.query(Contact).filter(Contact.id.notin_(sum(db.session.query(ContactList.friend_id).filter(ContactList.person_id == person.id).all(),()))).all()
    ##newFriends = db.engine.execute("select * from contact where id not in (select friend_id from contact_list where person_id = :val)",{'val':person.id})
    friendsList =[]
    for friend in newFriends:
        friendsList.append({'username':friend.username,'userprofileimage':friend.userprofileimage.decode('utf-8')})
    emit("display friends list",friendsList)

def getLoggedinUserContactList(loggedinUser):
    loggedinUserContacts=[]
    contactListOfLoggedinUser = ContactList.query.filter_by(person_id=loggedinUser.id).all()
    for contact in contactListOfLoggedinUser:
        person = Contact.query.filter_by(id=contact.friend_id).first()
        lastMessage = Message.query.filter(or_(and_(Message.senderName == loggedinUser.username,Message.recieverName==person.username),and_(Message.senderName==person.username,Message.recieverName==loggedinUser.username))).order_by(desc(Message.sentDate)).first()
        if person.userprofileimage is not None:
            if lastMessage is not None:
                if lastMessage.senderName == loggedinUser.username:
                    loggedinUserContacts.append({'name':person.username,'id':person.id,'profileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':'you: '+lastMessage.message,"type":"contact"})
                else:
                    loggedinUserContacts.append({'name':person.username,'id':person.id,'profileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':lastMessage.message,"type":"contact"})
            else:
                loggedinUserContacts.append({'name':person.username,'id':person.id,'profileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':"","type":"contact"})
        else:
            if lastMessage is not None:
                if lastMessage.senderName == loggedinUser.username:
                    loggedinUserContacts.append({'name':person.username,'id':person.id,'profileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':'you: '+lastMessage.message,"type":"contact"})
                else:
                    loggedinUserContacts.append({'name':person.username,'id':person.id,'profileimage':"data:image/png;base64,"+person.userprofileimage.decode('utf-8'),'lastMessage':lastMessage.message,"type":"contact"})
            else:
                loggedinUserContacts.append({'name':person.username,'id':person.id,'profileimage':"../static/images/image1.jpg",'lastMessage':"","type":"contact"})  
    return loggedinUserContacts   

def getLoggedinUserGroupList(loggedinUser):
    loggedinUserGroups=[]
    groups = Contact.query.filter_by(id = loggedinUser.id).first().groupmembers
    for group in groups:
        messagesList = Message.query.filter_by(recieverName = group.name).order_by(Message.sentDate.desc()).first()
        if messagesList is not None:
            lastmessage = messagesList.senderName+": "+messagesList.message    
        else:
            lastmessage = ""    
        if group.groupimage is not None:
            loggedinUserGroups.append({"name":group.name,"id":group.id,"profileimage":group.groupimage,"lastMessage":lastmessage,"type":"group"})
        else:
            loggedinUserGroups.append({"name":group.name,"id":group.id,"profileimage":"../static/images/image1.jpg","lastMessage":lastmessage,"type":"group"})
    return loggedinUserGroups
    

@socketio.on('add-friends-to-user')
def addContactsToUser(data):
    loggedinUserContacts=[]
    loggedinUserGroups=[]
    print(data)
    try:
            loggedinUser=Contact.query.filter_by(username=data["username"]).first()
            friendsList =[]
            for friend in data["friendsList"]:
                friendsList.append(Contact.query.filter_by(username=friend).first())
            addContactsForGivenUser(friendsList,loggedinUser)
            loggedinUserContacts = getLoggedinUserContactList(loggedinUser)
            loggedinUserGroups = getLoggedinUserGroupList(loggedinUser)
    except Exception as e:
        if hasattr(e,"message"):
            emit("after connect",{'error': e.message})
        else:
            emit("after connect",{'error':str(e)})            
    emit("after connect",{'selectedName':loggedinUserContacts[0]['name'],'name':loggedinUser.username,'contacts':loggedinUserContacts,'groups':loggedinUserGroups})

@socketio.on('add-group-to-user')
def addGroupToUser(data):
    try:
        loggedinUserContacts=[]
        loggedinUserGroups=[]
        loggedinUser=Contact.query.filter_by(username=data["username"]).first()
        newgroup = Group(name = data["groupname"], createdate = datetime.now(), creatername = data["username"], groupimage = data["groupimage"])
        db.session.add(newgroup)
        for friend in data["friendsList"]:
            newgroup.members.append(Contact.query.filter_by(username = friend).first())
        newgroup.members.append(loggedinUser)
        db.session.commit()
        loggedinUserContacts = getLoggedinUserContactList(loggedinUser)
        loggedinUserGroups = getLoggedinUserGroupList(loggedinUser)
    except Exception as e:
        if hasattr(e,"message"):
            emit("after connect",{'error': e.message})
        else:
            emit("after connect",{'error':str(e)})    
    emit("after connect",{'selectedName':loggedinUserContacts[0]['name'],'name':loggedinUser.username,'contacts':loggedinUserContacts,'groups':loggedinUserGroups})

if __name__ == '__main__':
    socketio.run(app,debug=True)