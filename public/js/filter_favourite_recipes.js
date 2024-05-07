import { changeFavouriteImg } from "./recipe_favourites.js";
import { mapEnumToCategory } from "./recipe_category_fav.js";

const filterForm = document.querySelector('form#search-box-without-burger');

const origin = document.location.origin;

filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    resetCategories();
    clearRecipes();

    document.querySelector('.recipes__container').setAttribute('data-state', 'load');

    const userId = 1;
    const name = document.querySelector('.search-box__input').value;

    fetch(`${origin}/recipes/favourites-by-name?name=${name}`, {
        method: 'GET',
    }).then(response => response.json())
    .then(data => {
        if (!data.recipes.length) {
            displayEmptyDataMessage();
        } else {
            displayRecipes(data.recipes);
        }
    }).catch(error => {
        handleError(error);
    });
});

export function filterFavouritesByCategiry(category) {
    document.querySelector('.search-box__input').value = '';
    clearRecipes();
    
    document.querySelector('.recipes__container').setAttribute('data-state', 'load');

    const userId = 1;

    fetch(`${origin}/recipes/favourites-by-category?category=${category}`, {
    method: 'GET',
    }).then(response => response.json())
    .then(data => {
        if (!data.recipes.length) {
            displayEmptyDataMessage();
        } else {
            displayRecipes(data.recipes);
        }
    }).catch(error => {
        handleError(error);
    });
}

export function findAllFavourites() {
    document.querySelector('.search-box__input').value = '';
    clearRecipes();
    
    document.querySelector('.recipes__container').setAttribute('data-state', 'load');

    const userId = 1;

    fetch(`${origin}/recipes/favourites-by-name?name=`, {
    method: 'GET',
    }).then(response => response.json())
    .then(data => {
        if (!data.recipes.length) {
            displayEmptyDataMessage();
        } else {
            displayRecipes(data.recipes);
        }
    }).catch(error => {
        handleError(error);
    });
}

function clearRecipes() {
    let notAddedMessage = document.querySelector('h2.not-added-message');
    if (notAddedMessage) notAddedMessage.style.display = 'none';

    document.querySelectorAll('.recipe').forEach(recipe => recipe.remove());
}

function resetCategories() {
    document.querySelectorAll('.catalog__link').forEach(link => {
        if (link.classList.contains('active')) {
            link.classList.remove('active');
        }
    })
}

function displayEmptyDataMessage() {
    document.querySelector('.recipes__container').setAttribute('data-state', 'not-found');
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
        newRecipe.querySelector('.recipe__favourite .recipe-addition__icon').addEventListener('click', changeFavouriteImg);
        
        recipesContainer.insertBefore(newRecipe, recipesContainer.querySelector('.preloader'));
    });
}