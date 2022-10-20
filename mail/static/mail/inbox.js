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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Submit the Query
  document.querySelector('#compose-form').onsubmit = () =>
  {
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');     
    })
    return false;
  }
}

function compose_reply(original_email)
{
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Set composition fields
  let compose_subject_value = document.querySelector('#compose-subject').value;
  if (compose_subject_value.startsWith("Re:")) {compose_subject_value = "";}
  else{compose_subject_value = "Re:";}
  
  document.querySelector('#compose-recipients').value = `${original_email.sender}`;
  document.querySelector('#compose-subject').value = `${compose_subject_value} ${original_email.subject}`;
  document.querySelector('#compose-body').value = `On ${original_email.timestamp} AM ${original_email.sender} wrote:
   ${original_email.body}`;
  
  // Submit the Query
  document.querySelector('#compose-form').onsubmit = () =>
  {
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');     
    })
    return false;
  }
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails in console
      console.log(emails);
      // Print the emails in page
      emails.forEach(email => {
        let element = document.createElement('div');
        let archived_button = document.createElement('button');
        let archived_state_view = "archive";
        if (email.archived)
        {
          archived_state_view = "unarchive";
        } 
        element.innerHTML = `
                              <b style="padding-right:25px">${email.sender}</b> 
                              ${email.subject} 
                              <b style="display:block; color:grey;">${email.timestamp}</b> 
                            `;
        archived_button.innerHTML = `${archived_state_view}`
        archived_button.style.marginBottom = `15px`; 
         
        if (email.read)
        {
          element.style.background = 'rgb(226, 223, 223)';
        }
        else
        {
          element.style.background = 'white';
        }
        // Open email 
        element.addEventListener('click', () => {
            open_email(email);
        });
        // Archive email
        archived_button.addEventListener('click', () => {
            let archived_state = !email.archived 
            archive_email(email, archived_state);
        });

        if (element !== null)
        {
          // Apply archive capabilities only in Inbox
          if (mailbox === "inbox" || mailbox === "archive")
          {
            archived_button.style.display = "block";
          }
          else {archived_button.style.display = "none";}
          document.querySelector('#emails-view').append(element);
          document.querySelector('#emails-view').append(archived_button);
        }
      });      
  });
}

function open_email(email) 
{
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
  
  //show Email page
  document.querySelector('#emails-view').innerHTML = 
  `
    <b>From:</b> ${email.sender}<br/>
    <b>To:</b> ${email.recipients}<br/>
    <b>Subject:</b> ${email.subject}<br/>
    <b>Timestamp:</b> ${email.timestamp}<br/>
    <button id="reply">Reply</button><br/>
    <p><hr style="border-width:1px;"></hr></p>
    ${email.body}
  `;
  const reply_button = document.querySelector("#reply");
  reply_button.addEventListener('click', () => compose_reply(email));
}


function archive_email(email, archived_state)
{ 
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archived_state
    })
  })
  .then(() => load_mailbox('inbox'))
    return false;
}