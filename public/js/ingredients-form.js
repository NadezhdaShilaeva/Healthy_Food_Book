const ingredientsButton = document.querySelector('.ingredients-form__button');
const ingredientsForm = document.getElementsByClassName('addition-form__column')[1];
const ingredientsTemplate = document.getElementById('ingredients').content;
const ingredientNameInput = form.ingredientname;
const ingredientQuantityInput = form.ingredientquantity;
const ingredientMesInput = form.ingredientmes;

ingredientsButton.addEventListener('click', addNewIngredient);

function addNewIngredient() {
    if (!ingredientNameInput.value || !ingredientQuantityInput.value || !ingredientMesInput.value) {
        alert('Введите параметры ингредиента!');
        return;
    }

    lastAddedIngredient = {
        name: formatIngredientName(ingredientNameInput.value),
        amount: Number(ingredientQuantityInput.value),
        measurement: ingredientMesInput.value,
    };
    addIngredient(ingredientNameInput.value, ingredientQuantityInput.value, mapMeasurement(ingredientMesInput.value));    

    resetIngredientParams();
}

export function addIngredient(ingredientName, ingredientQuantity, ingredientMes) {
    let newIngredient = createIngredient(ingredientName, ingredientQuantity, ingredientMes);
    let ingredientList = document.querySelector('.ingredients__list');

    if (ingredientList === null) {
        let ingredientsTemplate1 = ingredientsTemplate.cloneNode(true);
        ingredientsTemplate1.querySelector('.ingredients__list').appendChild(newIngredient);
        ingredientsForm.appendChild(ingredientsTemplate1);
    } else {
        ingredientList.appendChild(newIngredient);
    }
}

function createIngredient(ingredientNameText, ingredientQuantityText, ingredientMesRu) {
    let ingredientName = document.createElement('p');
    ingredientName.classList.add('ingredient__name');
    let valueName = formatIngredientName(ingredientNameText);
    ingredientName.textContent = valueName;

    let ingredientQuantity = document.createElement('p');
    ingredientQuantity.classList.add('ingredient__quantity');
    let valueQuantity = ingredientQuantityText;
    ingredientQuantity.textContent = `${valueQuantity} ${ingredientMesRu}`;

    let newIngredient = document.createElement('li');
    newIngredient.classList.add('ingredient__row', 'ingredient__row__removable');
    newIngredient.appendChild(ingredientName);
    newIngredient.appendChild(ingredientQuantity);
    newIngredient.addEventListener('click', removeIngredient);

    return newIngredient;
}

function formatIngredientName(ingredientName) {
    return ingredientName.charAt(0).toUpperCase() 
    + ingredientName.slice(1).toLowerCase();
}

function resetIngredientParams() {
    ingredientNameInput.value = '';
    ingredientQuantityInput.value = '';
    ingredientMesInput.forEach(element => {
        element.checked = false;
    });
    
    let selectMesTitle = ingredientsForm.querySelector('.select__title');    
    selectMesTitle.textContent = 'Ед.изм.';
    selectMesTitle.style.color = '#808080';
}

export function removeIngredient(event) {
    const ingredientQuantity = event.target.querySelector('.ingredient__quantity').textContent;    
    lastRemovedIngredient = {
        name: event.target.querySelector('.ingredient__name').textContent,
        amount: Number(ingredientQuantity.split(" ").at(0)),
        measurement: mapMeasurementToEnum(ingredientQuantity.slice(ingredientQuantity.indexOf(" ") + 1)),
    };

    let ingredintList = event.target.parentNode;
    ingredintList.removeChild(event.target);

    if (ingredintList.childElementCount === 0) {
        let ingredientsWrapper = ingredintList.parentNode;
        ingredientsWrapper.parentNode.removeChild(ingredientsWrapper);
    }
}

const resetButton = document.querySelector('.reset');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        document.querySelector('.addition-form__ingredients-preview').remove();
    });
}

export let lastAddedIngredient = {};
export let lastRemovedIngredient = {};

function mapMeasurement(measurement) {
    switch (measurement) {
        case 'g': return 'г';
        case 'kg': return 'кг';
        case 'l': return 'л';
        case 'ml': return 'мл';
        case 'teas': return 'ч. л.';
        case 'tables': return 'ст. л.';
        case 'piece': return 'шт';
        case 'glass': return 'стак.';
        default: return 'not defined';
    }
}

export function mapMeasurementToEnum(measurement) {
    switch (measurement) {
        case 'г': return 'g';
        case 'кг': return 'kg';
        case 'л': return 'l';
        case 'мл': return 'ml';
        case 'ч. л.': return 'teas';
        case 'ст. л.': return 'tables';
        case 'шт': return 'piece';
        case 'стак.': return 'glass';
        default: return 'not defined';
    }
}