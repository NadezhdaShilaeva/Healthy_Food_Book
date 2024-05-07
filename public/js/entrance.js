const loginFormContainer = document.querySelector('.main-container__login-form');
const loginFormRegistration = document.querySelector('.login-form__registration');
const regFormLogin = document.querySelector('.login-form__login');

loginFormRegistration.addEventListener('click', () => {
    loginFormContainer.classList.add('active');
});

regFormLogin.addEventListener('click', () => {
    loginFormContainer.classList.remove('active');
});