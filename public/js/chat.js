let lastMessageTime = 0;
const SEND_INTERVAL = 750; 

const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const chatContainer = document.querySelector(".messageContainer");

function scrollToBottom() {
  chatContainer.scrollTop =
    chatContainer.scrollHeight - chatContainer.clientHeight;
}

function createMessage(username, messageText, timestamp) {
  const messageBox = document.createElement("div");
  messageBox.classList.add("message");
  const time = document.createElement("p");
  time.classList.add("time");
  time.textContent = formatTimestamp(timestamp);
  messageBox.appendChild(time);
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
function formatTimestamp(timestamp) {
  const now = new Date(timestamp);
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutesStr + ' ' + ampm;
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
      const timestamp = Date.now();
      const data = { username, message, timestamp};
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
          createMessage(data.username, data.message, data.timestamp);
        } else if (response.status == 400) {
            messageInput.value = '';
            alert("Please avoid from using language like this.");
          }else if (response.status == 403) {
            alert("Invalid timestamp or attempt to recreate the send event. are you lagging too hard?");
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
    messages.forEach(m => {
      createMessage(m.username, m.message, m.timestamp);
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
setInterval(getMessages, 2500);
