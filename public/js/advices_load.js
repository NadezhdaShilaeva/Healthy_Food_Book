document.querySelector('.advices__button').addEventListener('click', loadAdvices);

async function loadAdvices() {
    document.querySelector('.advices').setAttribute('data-state', 'load');

    const skip = document.querySelector('.advices__list').childElementCount - 1;
    const take = 1;
    const origin = document.location.origin;

    fetch(`${origin}/advices/find-all?skip=${skip}&take=${take}`, {
        method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if (data.length < take) {
                hideLoadButton();
            }
            displayAdvices(data);
        }).catch(error => {
            handleError(error);
        });
}

function displayAdvices(jsonAdvices) {
    document.querySelector('.advices').setAttribute('data-state', '');

    let advicesContainer = document.querySelector('.advices__list');
    let adviceTemplate = document.querySelector('template#advice').content;
    
    jsonAdvices.forEach(advice => {
        let newAdvice = adviceTemplate.cloneNode(true);
        newAdvice.querySelector('img').setAttribute('src', `/${advice.image.path}`);
        newAdvice.querySelector('.advice__text').textContent = advice.description;
        advicesContainer.appendChild(newAdvice);
    });
}

function hideLoadButton() {
    document.querySelector('.advices__button').style.display = 'none';
}

function handleError(error) {
    console.error("Ошибка: ", error);
    document.querySelector('.advices').setAttribute('data-state', 'error');
}