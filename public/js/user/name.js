var firstTime = localStorage.getItem('firstTime');
const screen = document.getElementById('screen');

function promptUser() {
    screen.classList.add('screen');
    var notificationDiv = document.createElement('div');
    notificationDiv.classList.add('asknotifcation');
    var title = document.createElement('h1');
    title.classList.add('title');
    title.textContent = 'Welcome to arc!';
    var info = document.createElement('p');
    info.classList.add('info');
    info.textContent = 'We have detected that this is your first time using arc. Since this is your first time, please enter a username that everyone will see you as. (This will be for the chat and more features later on!)';
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter your username, EX: user123');
    input.classList.add('name');
    input.setAttribute('autocomplete', 'off');
    notificationDiv.appendChild(title);
    notificationDiv.appendChild(info);
    notificationDiv.appendChild(input);
    document.body.appendChild(notificationDiv);
    input.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            localStorage.setItem('user', input.value);
            document.body.removeChild(notificationDiv);
            screen.classList.remove('screen');
        }
    });
};

if(firstTime === null || firstTime === "true") {
    promptUser();
    localStorage.setItem('firstTime', 'false'); 
} else {
    
}