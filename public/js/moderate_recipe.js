import { removeIngredient, lastAddedIngredient, lastRemovedIngredient } from "./ingredients-form.js";

document.querySelectorAll('.parameter__choice').forEach(parameter => { 
    if (parameter.getAttribute('checked') === '') 
        parameter.previousElementSibling.click(); 
    }
);

document.querySelectorAll('.ingredient__row').forEach(ingredient => {
    ingredient.classList.add('ingredient__row__removable');
    ingredient.addEventListener('click', removeIngredient);
    ingredient.addEventListener('click', removeIngredientFromArray);
});

let addedIngredients = [];
let removedIngredients = [];

document.querySelector('.ingredients-form__button').addEventListener('click', addIngredientToArray);

function addIngredientToArray() {
    document.querySelector('.ingredients__list').lastElementChild.addEventListener('click', removeIngredientFromArray);

    addedIngredients.push(lastAddedIngredient);
}

function removeIngredientFromArray() {
    const ingredientIdx = addedIngredients.findIndex(ingr => 
        ingr.name === lastRemovedIngredient.name && 
        ingr.amount === lastRemovedIngredient.amount && 
        ingr.measurement === lastRemovedIngredient.measurement
    );

    if (ingredientIdx === -1) {
        removedIngredients.push(lastRemovedIngredient);
    } else {
        addedIngredients.splice(ingredientIdx, 1);
    }
}


const recipeId = document.location.pathname.split("/").slice(-1);
const recipeForm = document.querySelector('#form');
recipeForm.addEventListener('submit', approveRecipe);
document.querySelector('.remove').addEventListener('click', removeRecipe);

const origin = document.location.origin;

async function approveRecipe(event) {
    document.querySelector('.form__container').setAttribute('data-state', 'load');

    event.preventDefault();

    let response;

    for (const ingredient of addedIngredients) {
        response = await fetch(`${origin}/recipes/add-ingredient/${recipeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredient),
        }).then(response  => {
            if (response.ok) {
                return response;
            } else {
                response.json().then((json) => {
                    handleError(json.message);
                });
            }
        }).catch(error => {
            handleError(error);
        });

        if (!response) return;
    }

    for (const ingredient of removedIngredients) {
        response = await fetch(`${origin}/recipes/remove-ingredient/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredient),
        }).then(response  => {
            if (response.ok) {
                return response;
            } else {
                response.json().then((json) => {
                    handleError(json.message);
                });
            }
        }).catch(error => {
            handleError(error);
        });
    
        if (!response) return;
    }

    for (const textarea of document.querySelectorAll('.parameter__input__textarea')) {
        const cookingStepData = { number: Number(textarea.name.slice(4)), description: textarea.value };

        response = await fetch(`${origin}/recipes/add-cooking-step/${recipeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cookingStepData),
        }).then(response  => {
            if (response.ok) {
                return response;
            } else {
                response.json().then((json) => {
                    handleError(json.message);
                });
            }
        }).catch(error => {
            handleError(error);
        });

        if(!response) return;
    }

    const formData = new FormData();
    const recipeData = Object.fromEntries(new FormData(recipeForm));
    const imageField = document.querySelector('input[type="file"]');

    formData.append('name', recipeData.name);
    formData.append('category', recipeData.category);
    formData.append('hours', recipeData.hours);
    formData.append('minutes', recipeData.minutes);
    formData.append('portions', recipeData.portions);
    formData.append('image', imageField.files[0]);

    response = await fetch(`${origin}/recipes/approve/${recipeId}`, {
        method: 'PATCH',
        body: formData,
    }).then(response  => {
        if (response.ok) {
            document.querySelector('.form__container').setAttribute('data-state', 'success');
        } else {
            response.json().then((json) => {
                handleError(json.message);
            });
        }
    }).catch(error => handleError(error));
}

async function removeRecipe() {
    document.querySelector('.form__container').setAttribute('data-state', 'load');

    await fetch(`${origin}/recipes/remove/${recipeId}`, { 
        method: 'DELETE' 
    }).then(response => {
        if (response.ok) {
            document.querySelector('.form__container').setAttribute('data-state', 'removed');
        } else {
            response.json().then((json) => {
                handleError(json.message);
            });
        }
    }).catch(error => handleError(error));
}

function handleError(error) {
    document.querySelector('.message__text').textContent = error;
    document.querySelector('.form__container').setAttribute('data-state', 'error');
}