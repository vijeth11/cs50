document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(recipient = '',subject = '',body='') {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#sent-view').style.display = 'none';
  document.querySelector('#archived-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipient;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#selected-name').innerHTML = `${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}`;
  if(mailbox == 'inbox'){
    document.querySelector('#inbox-view').style.display = 'block';
    document.querySelector('#sent-view').style.display = 'none';
    document.querySelector('#archived-view').style.display = 'none';
    document.querySelector('#inbox-view').innerHTML = "";
    getInbox();
  }
  if(mailbox == 'sent'){
    document.querySelector('#inbox-view').style.display = 'none';
    document.querySelector('#sent-view').style.display = 'block';
    document.querySelector('#archived-view').style.display = 'none';
    document.querySelector('#sent-view').innerHTML = "";
    getSentEmails();
  }
  if(mailbox == 'archive'){
    document.querySelector('#inbox-view').style.display = 'none';
    document.querySelector('#sent-view').style.display = 'none';
    document.querySelector('#archived-view').style.display = 'block';
    document.querySelector('#archived-view').innerHTML = "";
    getArchivedEmails();
  }
}

function load_email_view(emailid){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#sent-view').style.display = 'none';
  document.querySelector('#archived-view').style.display = 'none';
  fetch('/emails/'+emailid)
  .then(response => response.json())
  .then(email => {
      // Print email
      document.querySelector('#email-from').innerHTML = email['sender'];
      document.querySelector('#email-to').innerHTML = email['recipients'][0];
      document.querySelector('#email-subject').innerHTML = email['subject'];
      document.querySelector('#email-timestamp').innerHTML = email['timestamp'];
      document.querySelector('#email-body').innerHTML = email['body'];
      // ... do something else with email ...
  });
  updateTheEmail(emailid,{read:true},'');
  document.querySelector('#reply').addEventListener('click',function () {
      let subject =  document.querySelector('#email-subject').innerHTML;
      let reciever =  document.querySelector('#email-from').innerHTML;
      if(!subject.includes("Re:")){
        subject = "Re: "+subject;
      }
      let body = "On "+document.querySelector('#email-timestamp').innerHTML+" "+reciever+" wrote: \r"+document.querySelector('#email-body').innerHTML;
      compose_email(reciever,subject,body);
  });
}

function sendEmail(event){
  event.preventDefault();
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => {
    response.json();
  })
  .then(result => {
      // Print result
      load_mailbox('sent');
  });
}

function getInbox(){
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      for(var email of emails){
        const button = document.createElement('button');
        button.setAttribute('style','float:right');
        button.setAttribute('class','btn btn-danger');
        button.innerHTML = "Archive";
        button.addEventListener('click',function (event){
            updateTheEmail( event.target.parentElement.id,{archived: true},'inbox');
        });
        const span = document.createElement('span')
        span.innerHTML = email['sender'] + ' '+email['subject']+' '+email['timestamp'];  
        span.addEventListener('click', function(event) {
          load_email_view(event.target.parentElement.id);
        });
        const element = document.createElement('div');     
        element.setAttribute('class','mails');
        element.appendChild(span);
        element.id = email['id'];
        if(email['read']){
          element.style.backgroundColor = 'white';
        }else{
          element.style.backgroundColor = 'grey';
        }
        element.appendChild(button);        
        document.querySelector('#inbox-view').appendChild(element);
      }
  });
}

function getSentEmails(){
  fetch('/emails/sent')
  .then(response => response.json())
  .then(emails => {
      for(var email of emails){
        const element = document.createElement('div');
        element.innerHTML = email['recipients'][0] + ' '+email['subject']+' '+email['timestamp'];
        element.style.border="1px solid black";
        element.style.padding = "5px";
        element.setAttribute('class','mails');
        element.id = email['id'];
        if(email['read']){
          element.style.backgroundColor = 'white';
        }else{
          element.style.backgroundColor = 'grey';
        }
        element.addEventListener('click', function(event) {
            load_email_view(event.currentTarget.id);
        });
        document.querySelector('#sent-view').appendChild(element);
      }
  });
}

function getArchivedEmails(){
  fetch('/emails/archive')
  .then(response => response.json())
  .then(emails => {
      for(var email of emails){
        const button = document.createElement('button');
        button.setAttribute('style','float:right');
        button.setAttribute('class','btn btn-success');
        button.innerHTML = "Unarchive";
        button.addEventListener('click',function (event){
            updateTheEmail( event.target.parentElement.id,{archived: false},'inbox');            
        });
        const element = document.createElement('div');
        element.innerHTML = email['recipients'][0] + ' '+email['subject']+' '+email['timestamp'];
        element.setAttribute('class','archive-mails');
        element.id = email['id'];
        if(email['read']){
          element.style.backgroundColor = 'white';
        }else{
          element.style.backgroundColor = 'grey';
        }
        element.appendChild(button);
        document.querySelector('#archived-view').appendChild(element);
      }
  });
}

function updateTheEmail(emailid,parameter,loadview){
  fetch('/emails/'+emailid, {
    method: 'PUT',
    body: JSON.stringify(parameter)
  })
  .then(email => {
    if(loadview){
      load_mailbox(loadview);
    }
  });
}