const chatStatus = document.querySelector(".chat__status");
const chatMessages = document.querySelector(".chat__messages");
const chatForm = document.querySelector(".chat__send-msg-form");
const chatMsgText = document.querySelector(".chat__send-msg-text");
const maxRandomNumber = 1000;

const userName = prompt("Enter your name, please") || `User${Math.floor(Math.random() * maxRandomNumber)}`;

function handleMsg(name, text, time, origin) {
  return `
    <div class="chat__msg-block chat__msg-block--${origin}">
      <p class="chat__msg-owner">${name}</p>
      <p class="chat__msg-text">${text}</p>
      <p class="chat__msg-time">${time}</p>
    </div>
  `;
}

const socket = new WebSocket(`ws://localhost:8080`);

socket.onopen = function (e) {
  chatStatus.innerHTML = `Connected to Server: ${e.currentTarget.url}`;
};

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msgText = chatMsgText.value;
  chatMsgText.value = "";

  const msgTime = new Date().toLocaleTimeString("en-GB");

  const msgFullContent = { name: userName, text: msgText, time: msgTime };

  socket.send(JSON.stringify(msgFullContent));

  const msgBlock = handleMsg(userName, msgText, msgTime, "host");

  chatMessages.innerHTML += msgBlock;
});

socket.onmessage = function (e) {
  const { name, text, time } = JSON.parse(e.data);

  const msgBlock = handleMsg(name, text, time, "guest");

  chatMessages.innerHTML += msgBlock;
};
