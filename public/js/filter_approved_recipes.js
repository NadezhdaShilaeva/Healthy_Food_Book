import { resetParameterSelect } from "./parameter__select.js";
import { mapEnumToCategory, mapCategoryToEnum } from "./recipe_category.js";
import { changeFavouriteImg } from "./recipe_favourites.js"; 

let filterByNameForm = document.querySelector('form#search-box-without-burger');
let filterByParametersForm = document.querySelector('form.search-by-par');

const origin = document.location.origin;

let lastFilterBy = "all";

filterByNameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    resetCategories();
    resetParametersForm();
    clearRecipes();

    document.querySelector('.recipes__container').setAttribute('data-state', 'load');

    findByName(0, 3);
    lastFilterBy = "name";
});

export function findAllRecipes() {
    resetParametersForm();
    filterByNameForm.reset();
    resetCategories();
    clearRecipes();
    
    document.querySelector('.recipes__container').setAttribute('data-state', 'load');
        
    findAll(0, 3);
    lastFilterBy = "all";
}

export function filterByCategory(category) {
    resetParametersForm();
    filterByNameForm.reset();
    clearRecipes();
    
    document.querySelector('.recipes__container').setAttribute('data-state', 'load');
        
    findByCategory(category, 0, 3);
    lastFilterBy = "category";
}

filterByParametersForm.addEventListener('submit', (event) => {    
    event.preventDefault();
    resetCategories();
    filterByNameForm.reset();
    clearRecipes();

    document.querySelector('.recipes__container').setAttribute('data-state', 'load');

    findByCategoryAndIngredientsAndTime(0, 3);
    lastFilterBy = "ingredients";   
});

document.querySelector('.recipes__button').addEventListener('click', loadRecipes);

async function loadRecipes() {
    document.querySelector('.recipes__container').setAttribute('data-state', 'load');

    const skip = document.querySelectorAll('.recipe').length;
    const take = 3;

    if (lastFilterBy === "all") {
        findAll(skip, take);
    } else if (lastFilterBy === "name") {
        findByName(skip, take);
    } else if (lastFilterBy === "category") {
        const category = mapCategoryToEnum(document.querySelector('.catalog__link.active').textContent.trim());
        findByCategory(category, skip, take);
    } else {
        findByCategoryAndIngredientsAndTime(skip, take);
    }
}

function findAll(skip, take) {
    fetch(`${origin}/recipes/approved?skip=${skip}&take=${take}`, {
        method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if (!data.length && !skip) displayEmptyDataMessage();
            else displayRecipes(data);
            if (data.length < take) hideLoadButton();
        }).catch(error => handleError(error));
}

function findByName(skip, take) {
    const name = document.querySelector('.search-box__input').value;

    fetch(`${origin}/recipes/find-by-name?name=${name}&skip=${skip}&take=${take}`, {
        method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if (!data.length && !skip) displayEmptyDataMessage();
            else displayRecipes(data);
            if (data.length < take) hideLoadButton();
        }).catch(error => {
            handleError(error);
        });
}

function findByCategory(category, skip, take) {    
    fetch(`${origin}/recipes/find-by-category?category=${category}&skip=${skip}&take=${take}`, {
        method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if (!data.length && !skip) displayEmptyDataMessage();
            else displayRecipes(data);
            if (data.length < take) hideLoadButton();
        }).catch(error => handleError(error));
}

function findByCategoryAndIngredientsAndTime(skip, take) {
    const filterData = Object.fromEntries(new FormData(filterByParametersForm));

    let url = `${origin}/recipes/find-by-category-ingredients-time?category=${filterData.category}&`;    
    filterByParametersForm.querySelectorAll('.selectize-input.items .item').forEach(ingredElem => {
        url += `ingredient=${ingredElem.textContent}&`;
    });
    url += `min=${filterData.time}&skip=${skip}&take=${take}`;
    console.log(url);

    fetch(url, {
        method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if (!data.length && !skip) displayEmptyDataMessage();
            else displayRecipes(data);
            if (data.length < take) hideLoadButton();
        }).catch(error => handleError(error));
}

function clearRecipes() {
    document.querySelectorAll('.recipe').forEach(recipe => recipe.remove());
}

function resetCategories() {
    document.querySelectorAll('.catalog__link').forEach(link => {
        if (link.classList.contains('active')) {
            link.classList.remove('active');
        }
    })
}

function resetParametersForm() {
    filterByParametersForm.reset();
    resetParameterSelect();
}

function displayEmptyDataMessage() {
    document.querySelector('.recipes__container').setAttribute('data-state', 'not-found');
}

function hideLoadButton() {
    document.querySelector('.recipes__button').style.display = 'none';
}

function handleError(error) {
    console.log(error);
    document.querySelector('.recipes__container').setAttribute('data-state', 'error');
}

function displayRecipes(jsonRecipes) {
    let recipesContainer = document.querySelector('.recipes__container');
    recipesContainer.setAttribute('data-state', '');
    let recipeTemplate = document.querySelector('template#recipe').content;
    
    jsonRecipes.forEach(recipe => {
        let newRecipe = recipeTemplate.cloneNode(true);

        newRecipe.querySelector('img').setAttribute('src', `/${recipe.image.path}`);
        newRecipe.querySelector('.recipe__link').setAttribute('href', `/recipes/recipe/${recipe.id}`);

        newRecipe.querySelector('.recipe__name h2').textContent = recipe.name;
        newRecipe.querySelector('.recipe__name').setAttribute('href', `/recipes/recipe/${recipe.id}`);

        newRecipe.querySelector('.recipe__category p').textContent = mapEnumToCategory(recipe.category);

        let recipeTime = '';
        if (recipe.hours) recipeTime += `${recipe.hours} ч `;
        if (recipe.minutes) recipeTime += `${recipe.minutes} мин`;
        newRecipe.querySelector('.recipe__time p').textContent = recipeTime;

        newRecipe.querySelector('.recipe__favourite p').textContent = recipe.likes;
        if (recipe.isLiked) {
            newRecipe.querySelector('.recipe__favourite .recipe-addition__icon').setAttribute('src', '/images/icons/heart_full.png');
        } else {
            newRecipe.querySelector('.recipe__favourite .recipe-addition__icon').setAttribute('src', '/images/icons/heart.png');
        }
        newRecipe.querySelector('.recipe__favourite .recipe-addition__icon').addEventListener('click', changeFavouriteImg);
        
        recipesContainer.insertBefore(newRecipe, recipesContainer.querySelector('.preloader'));
    });
}