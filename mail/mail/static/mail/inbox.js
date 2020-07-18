document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#sent-view').style.display = 'none';
  document.querySelector('#archived-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
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
  }
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
      const element = document.createElement('div');
      element.innerHTML = email['sender'] + ' '+email['subject']+' '+email['timestamp'];
      element.style.border="1px solid black";
      element.style.padding = "5px";
      element.id = email['id'];
      if(email['read']){
        element.style.backgroundColor = 'white';
      }else{
        element.style.backgroundColor = 'grey';
      }
      element.addEventListener('click', function(event) {
          console.log(event.currentTarget.id);
      });
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
      element.id = email['id'];
      element.addEventListener('click', function(event) {
          console.log(event.currentTarget.id);
      });
      document.querySelector('#sent-view').appendChild(element);
    }
});
}