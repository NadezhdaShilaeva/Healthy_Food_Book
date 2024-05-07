import { mapMeasurementToEnum } from "./ingredients-form.js";

const recipeForm = document.querySelector('#form');
const imageField = document.querySelector('input[type="file"]');

const origin = document.location.origin;

recipeForm.addEventListener('submit', createRecipe);

async function createRecipe(event) {
    document.querySelector('.form__container').setAttribute('data-state', 'load');

    event.preventDefault();

    const formData = new FormData();
    const recipeData = Object.fromEntries(new FormData(recipeForm));

    formData.append('name', recipeData.name);
    formData.append('category', recipeData.category);
    formData.append('hours', recipeData.hours);
    formData.append('minutes', recipeData.minutes);
    formData.append('portions', recipeData.portions);
    formData.append('image', imageField.files[0]);

    let response = await fetch(`${origin}/recipes/create`, {
        method: 'POST',
        body: formData,
    }).then(response  => {
        if (response.ok) {
            return response;
        } else {
            response.json().then((json) => {
                handleError(json.message);
            });
        }
    }).catch(error => handleError(error));

    if (!response) return;

    const recipeId = await response.json();

    for (const ingredient of document.querySelectorAll('.ingredient__row')) {
        const ingredientQuantity = ingredient.querySelector('.ingredient__quantity').textContent;
        const ingredientData = {
            name: ingredient.querySelector('.ingredient__name').textContent,
            amount: Number(ingredientQuantity.split(" ")[0]),
            measurement: mapMeasurementToEnum(ingredientQuantity.slice(ingredientQuantity.indexOf(" ") + 1)),
        };

        response = await fetch(`${origin}/recipes/add-ingredient/${recipeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredientData),
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

        if(!response) break;
    }
    
    if (!response) {
        removeRecipe(recipeId);
        return;
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

        if(!response) break;
    }

    if (response) {        
        document.querySelector('.form__container').setAttribute('data-state', 'success');
        document.querySelector('.reset').click();
    } else {
        removeRecipe(recipeId);
    }
}

function handleError(error) {
    document.querySelector('.message__text').textContent = error;
    document.querySelector('.form__container').setAttribute('data-state', 'error');
}

function removeRecipe(recipeId) {
    fetch(`${origin}/recipes/remove/${recipeId}`, { method: 'DELETE' });
}