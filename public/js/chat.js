let lastMessageTime = 0;
const SEND_INTERVAL = 750; 

const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const chatContainer = document.querySelector(".messageContainer");

function scrollToBottom() {
  chatContainer.scrollTop =
    chatContainer.scrollHeight - chatContainer.clientHeight;
}

function createMessage(username, messageText) {
  const messageBox = document.createElement("div");
  messageBox.classList.add("message");
  const usernameElement = document.createElement("h5");
  usernameElement.classList.add("username");
  usernameElement.textContent = username;
  messageBox.appendChild(usernameElement);
  const textMessage = document.createElement("p");
  textMessage.classList.add("textMessage");
  textMessage.textContent = messageText;
  messageBox.appendChild(textMessage);
  
  chatContainer.appendChild(messageBox);
  scrollToBottom();
}

sendButton.addEventListener("click", async function () {
    const currentTime = Date.now();
    if (currentTime - lastMessageTime < SEND_INTERVAL) {
      alert("Please wait before sending another message.");
      return;
    }
    lastMessageTime = currentTime;
  
    const message = messageInput.value.trim();
    if (message) {
      const username = localStorage.getItem('user');
      const data = { username, message };
      try {
        const response = await fetch('/sendmessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          messageInput.value = '';
          createMessage(data.username, data.message);
        } else {
          if(response.status == 400) {
            messageInput.value = '';
            alert("Please avoid from using language like this.");
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

async function getMessages() {
  try {
    const response = await fetch('/messages');
    const messages = await response.json();
    chatContainer.innerHTML = '';
    messages.forEach(message => {
      createMessage(message.username, message.message);
    });
    scrollToBottom();
  } catch (error) {
    console.error('Error:', error);
  }
}

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

window.onload = getMessages;
setInterval(getMessages, 1000);
