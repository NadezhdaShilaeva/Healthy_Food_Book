const deleteForm = document.querySelector('.delete__button');

const origin = document.location.origin;

deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(deleteForm);
    const data = Object.fromEntries(formData);

    fetch(`${origin}/users/delete`, {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response  => {
        if (!response.ok) {
            response.json().then((json) => {
                handleError(json.message);
            });
        }

        if (response.redirected) {
            window.location.replace(response.url);
        }
    }).catch(error => {
        console.log(error);
        handleError(error);
    });
});

function handleError(error) {
    document.getElementsByClassName('message__text').textContent = error;
}