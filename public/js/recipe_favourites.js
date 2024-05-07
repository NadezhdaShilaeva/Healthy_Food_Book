document.querySelectorAll('.recipe__favourite .recipe-addition__icon').forEach(item => {
    item.addEventListener('click', changeFavouriteImg);
});

let imgHeart = '/images/icons/heart.png';
let imgHeartFull = '/images/icons/heart_full.png';

export function changeFavouriteImg(event) {
    let elem = event.target;

    let recipeHref = elem.parentElement.parentElement.firstElementChild.getAttribute('href');

    if (!recipeHref) {
        recipeHref = document.location.href;
    }

    const recipeId = recipeHref.split("/").at(-1);

    if (elem.getAttribute('src') === imgHeart) {
        addToFavourites(recipeId, elem);
    } else {
        removeFromFavourites(recipeId, elem);
    }
}

const origin = document.location.origin;

async function addToFavourites(recipeId, elem) {
    increaseLikes(elem);

    await fetch(`${origin}/recipes/add-to-favourites?recipeId=${recipeId}`, {
        method: 'POST'
    }).then(response => {
        if (!response.ok) {
            decreaseLikes(elem);
        }

        if (response.redirected) {
            window.location.replace(response.url);
        }
    }).catch(error => {
        decreaseLikes(elem);
        console.log(error);
    });
}

async function removeFromFavourites(recipeId, elem) {
    decreaseLikes(elem);

    await fetch(`${origin}/recipes/remove-from-favourites?recipeId=${recipeId}`, {
        method: 'POST'
    }).then(response => {
        if (!response.ok) {
            increaseLikes(elem);
        }

        if (response.redirected) {
            window.location.replace(response.url);
        }
    }).catch(error => {
        increaseLikes(elem);
        console.log(error);
    });
}

function increaseLikes(elem) {
    elem.setAttribute('src', imgHeartFull);

    const likesElem = elem.nextElementSibling;

    if (isNaN(Number(likesElem.textContent))) {
        likesElem.textContent = "Удалить из любимых";
    } else {
        likesElem.textContent = Number(likesElem.textContent) + 1;
    }
}

function decreaseLikes(elem) {
    elem.setAttribute('src', imgHeart);

    const likesElem = elem.nextElementSibling;

    if (isNaN(Number(likesElem.textContent))) {
        likesElem.textContent = "Добавить в любимые";
    } else {
        likesElem.textContent = Number(likesElem.textContent) - 1;
    }
}
