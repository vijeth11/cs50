import os
try:
    from flask_sqlalchemy import SQLAlchemy
    from sqlalchemy import or_,and_,not_,desc,ForeignKey
    from sqlalchemy.orm import relationship
    from sqlalchemy.ext.declarative import declarative_base
except:
    os.system('pip install flask_sqlalchemy')
    from flask_sqlalchemy import SQLAlchemy
    from sqlalchemy import or_,and_,not_,desc,ForeignKey
    from sqlalchemy.orm import relationship
    from sqlalchemy.ext.declarative import declarative_base
db = SQLAlchemy()


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    userprofileimage = db.Column(db.String(20000),nullable=True)
    previousContact = db.Column(db.String(100))
    

class ContactList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column( db.Integer, nullable=False)
    friend_id = db.Column( db.Integer, nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    senderName = db.Column(db.String(100),nullable = False)
    recieverName = db.Column(db.String(100),nullable = False)
    message = db.Column(db.String(1000),nullable=False)
    sentDate = db.Column(db.DateTime,nullable=False)
    attachment = db.relationship("Attachment", uselist=False, backref='message')

class Attachment(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'),unique=True)
    filename = db.Column(db.String,nullable=False)
    filetype = db.Column(db.String,nullable=False)
    file=db.Column(db.String,nullable=False)