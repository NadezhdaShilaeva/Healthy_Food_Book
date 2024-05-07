import { changeSelectTitle } from './parameter__select.js';
import { createNewTextArea } from './instruction-form.js';
import { addIngredient } from './ingredients-form.js';

const localStorage = window.localStorage;

(window.addEventListener('load', () => {
    for (let i = 0; i < localStorage.length; ++i) {
        let keyName = localStorage.key(i);

        if (keyName === 'ingredients') {
            let ingredients = JSON.parse(localStorage.getItem(keyName));
            ingredients.list.forEach(ingredient => {
                addIngredient(ingredient.name, ingredient.quantity.split(' ')[0], ingredient.quantity.slice(ingredient.quantity.indexOf(" ") + 1));
            });
            continue;
        }

        if (keyName.slice(0, -1) === 'step' && Number(keyName.slice(-1)) > 2) {
            createNewTextArea();
        }

        let element = form.querySelector(`[name='${keyName}']`);
        let elementValue = localStorage.getItem(keyName);
        if (element.type === 'file') {
            continue;
        } else if (element.type === 'radio') {
            form.querySelector(`[name='${keyName}'][value='${elementValue}']`).setAttribute('checked', '');
            changeSelectTitle(form.querySelector(`.parameter__option[for='${elementValue}']`));
        } else {
            element.value = elementValue;
        }
    }
}));


document.querySelector('button.save').addEventListener('click', () => {
    document.querySelectorAll('input').forEach(input => {
        if (input.type === 'radio') {
            if (input.checked === true) {
                localStorage.setItem(input.name, input.value);
            }
        } else {
            localStorage.setItem(input.name, input.value);
        }
    });
    document.querySelectorAll('textarea').forEach(textarea => {
        localStorage.setItem(textarea.name, textarea.value);
    });
    localStorage.setItem('ingredients', JSON.stringify(createIngredientsJSON()));
});

function createIngredientsJSON() {
    let ingredients = { list:[] }
    document.querySelectorAll('.ingredient__row').forEach(ingredient => {
        ingredients.list.push({
            name: ingredient.querySelector('.ingredient__name').textContent.trim(),
            quantity: ingredient.querySelector('.ingredient__quantity').textContent.trim()
        });
    });

    return ingredients;
}