const loginIdx = 0;
const regIdx = 1;

const loginForm = document.getElementsByClassName('form')[loginIdx];
const regForm = document.getElementsByClassName('form')[regIdx];

const origin = document.location.origin;

loginForm.addEventListener('submit', (event) => {
    document.getElementsByClassName('form__container')[loginIdx].setAttribute('data-state', 'load');

    event.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    fetch(`${origin}/auth/login`, {
        method: 'POST',
        redirect: 'follow',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response  => {
        if (!response.ok) {
            response.json().then((json) => {
                handleError(json.message, loginIdx);
            });
        }

        if (response.redirected) {
            window.location.replace(response.url);
        }
    }).catch(error => {
        console.log(error);
        handleError(error, loginIdx);
    });
});

regForm.addEventListener('submit', (event) => {
    document.getElementsByClassName('form__container')[regIdx].setAttribute('data-state', 'load');

    event.preventDefault();

    const formData = new FormData(regForm);
    const data = Object.fromEntries(formData);

    fetch(`${origin}/users/create-guest`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response  => {
        if (!response.ok) {
            response.json().then((json) => {
                handleError(json.message, regIdx);
            });
        }
        
        if (response.redirected) {
            window.location.replace(response.url);
        }
    }).catch(error => {
        console.log(error);
        handleError(error, regIdx);
    });
});

function handleError(error, idx) {
    document.getElementsByClassName('message__text')[idx].textContent = error;
    document.getElementsByClassName('form__container')[idx].setAttribute('data-state', 'error');
}