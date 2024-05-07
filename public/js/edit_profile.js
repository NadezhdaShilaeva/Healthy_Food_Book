const editForm = document.querySelector('.form');

const origin = document.location.origin;

editForm.addEventListener('submit', (event) => {
    document.querySelector('.form__container').setAttribute('data-state', 'load');

    event.preventDefault();

    const formData = new FormData(editForm);
    const data = Object.fromEntries(formData);

    fetch(`${origin}/users/update`, {
        method: 'PATCH',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response  => {
        if (response.ok) {
            console.log(data);
            document.querySelector('.form__container').setAttribute('data-state', 'success');
        } else {
            response.json().then((json) => {
                handleError(json.message);
            });
        }
    }).catch(error => {
        console.log(error);
        handleError(error);
    });
});

function handleError(error) {
    document.querySelector('.message__text').textContent = error;
    document.querySelector('.form__container').setAttribute('data-state', 'error');
}