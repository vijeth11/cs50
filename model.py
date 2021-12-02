import os
try:
    from flask_sqlalchemy import SQLAlchemy
    from sqlalchemy import or_,and_,not_,desc,ForeignKey
    from sqlalchemy.orm import relationship,backref
    from sqlalchemy.ext.declarative import declarative_base
except:
    os.system('pip install flask_sqlalchemy')
    from flask_sqlalchemy import SQLAlchemy
    from sqlalchemy import or_,and_,not_,desc,ForeignKey
    from sqlalchemy.orm import relationship,backref
    from sqlalchemy.ext.declarative import declarative_base
db = SQLAlchemy()

groupmembers = db.Table("groupmembers",
                db.Column("groupid", db.Integer, db.ForeignKey('group.id')),
                db.Column("contactid", db.Integer,db.ForeignKey('contact.id')))

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(80), nullable = False)
    email = db.Column(db.String(120), nullable = False)
    password = db.Column(db.String(120), nullable = False)
    userprofileimage = db.Column(db.String(20000), nullable = True)
    previousContact = db.Column(db.String(100))
    #groupcontact = db.relationship("GroupContact",uselist = False, backref = backref("contact"), lazy="joined") one type to create many to many
    groupmembers = db.relationship("Group", secondary = groupmembers, backref = backref("members",lazy = "dynamic"))

class ContactList(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    person_id = db.Column( db.Integer, nullable = False)
    friend_id = db.Column( db.Integer, nullable = False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    senderName = db.Column(db.String(100), nullable = False)
    recieverName = db.Column(db.String(100), nullable = False)
    message = db.Column(db.String(1000), nullable = False)
    sentDate = db.Column(db.DateTime, nullable = False)
    attachment = db.relationship("Attachment", uselist = False, backref = 'message')

class Attachment(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'), unique = True)
    filename = db.Column(db.String, nullable = False)
    filetype = db.Column(db.String, nullable = False)
    file=db.Column(db.String, nullable = False)

class Group(db.Model):
    id=db.Column(db.Integer, primary_key = True, nullable = False)
    name = db.Column(db.String, nullable = False, unique = True)
    createdate = db.Column(db.DateTime, nullable = False)
    creatername = db.Column(db.String, nullable = False)
    groupimage = db.Column(db.String, nullable = True)
    #groupcontact = db.relationship("GroupContact",uselist = False, backref = backref("group"), lazy="joined") one type to create many-to-many

'''
one way to do many to many 
class GroupContact(db.Model):
    groupid = db.Column(db.Integer, db.ForeignKey('group.id'), primary_key = True)
    contactid = db.Column(db.Integer,db.ForeignKey('contact.id'), primary_key = True)
'''

