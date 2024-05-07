const socket = io(document.location.origin);
socket.on('msgToClient', (message) => {
    receivedMessage(message);
});

const usernameElem = document.querySelector('#username');
const emailElem = document.querySelector('#email');
const roleElem = document.querySelector('#role');
const messageTextElem = document.querySelector('#message');
const messagesContainer = document.querySelector('.messages__list');

document.querySelector('#send').addEventListener('click', sendMessage)

function sendMessage(event) {
    event.preventDefault();

    if(validateInput()) {
        const message = {
            username: usernameElem.lastChild.textContent.trim(),
            email: emailElem.lastChild.textContent.trim(),
            role: roleElem ? roleElem.lastChild.textContent.trim().toLowerCase() : "гость",
            text: messageTextElem.value,
        }

        socket.emit('msgToServer', message);
        messageTextElem.value = '';
    }
}

function validateInput() {
    return messageTextElem.value.length > 0;
}

function drawOutgoingMessage(message) {
    let outgoingMessage = document.createElement('li');
    outgoingMessage.classList.add('message', 'outgoing-message');

    drawTextInMessage(outgoingMessage, message);    
}

function drawIncomigMessage(message) {
    let outgoingMessage = document.createElement('li');
    outgoingMessage.classList.add('message', 'incoming-message');

    drawTextInMessage(outgoingMessage, message);
}

function drawTextInMessage(messageElemLi, message) {
    let usernameTextElem = document.createElement('p');
    usernameTextElem.classList.add('username__text');
    usernameTextElem.textContent = message.username;

    let userElem = document.createElement('div');
    userElem.classList.add('user');
    userElem.appendChild(usernameTextElem);

    if (message.role === "админ" || message.role === "модератор") {
        let roleTextElem = document.createElement('p');
        roleTextElem.classList.add('role__text');
        roleTextElem.textContent = message.role;

        userElem.appendChild(roleTextElem);
    }

    messageElemLi.appendChild(userElem);

    let messageTextElem = document.createElement('p');
    messageTextElem.classList.add('message__text');
    messageTextElem.textContent = message.text;
    messageElemLi.appendChild(messageTextElem);


    let timeTextElem = document.createElement('p');
    timeTextElem.classList.add('time__text');
    timeTextElem.textContent = `${message.hours}:${String(message.minutes).padStart(2, '0')}`;
    messageElemLi.appendChild(timeTextElem);

    if (messagesContainer.childElementCount === 10) {
        messagesContainer.firstElementChild.remove();
    }
    
    messagesContainer.appendChild(messageElemLi);
}

function receivedMessage(message) {
    if (!messagesContainer.style.display) {
        messagesContainer.style.display = 'flex';
    }

    if (message.email === emailElem.lastChild.textContent.trim()) {
        drawOutgoingMessage(message);
    } else {
        drawIncomigMessage(message);
    }
}