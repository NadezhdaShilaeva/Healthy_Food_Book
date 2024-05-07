const adviceForm = document.querySelector('#form');
const imageField = document.querySelector('input[type="file"]');

adviceForm.addEventListener('submit', createAdvice);

function createAdvice(event) {
    document.querySelector('.form__container').setAttribute('data-state', 'load');

    event.preventDefault();
    

    const formData = new FormData();
    const adviceData = Object.fromEntries(new FormData(adviceForm));

    formData.append('description', adviceData.description);
    formData.append('image', imageField.files[0]);

    const origin = document.location.origin;

    fetch(`${origin}/advices/create`, {
        method: 'POST',
        body: formData,
    }).then(response  => {
        if (response.ok) {
            document.querySelector('.form__container').setAttribute('data-state', 'success');
            adviceForm.reset();
        } else {
            response.json().then((json) => {
                handleError(json.message);
            });
        }
    }).catch(error => {
        handleError(error);
    });
}

function handleError(error) {
    document.querySelector('.message__text').textContent = error;
    document.querySelector('.form__container').setAttribute('data-state', 'error');
}