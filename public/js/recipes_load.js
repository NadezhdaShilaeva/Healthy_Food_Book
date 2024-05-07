import { changeFavouriteImg } from './recipe_favourites.js';

document.querySelector('.recipes__button').addEventListener('click', loadRecipes);

async function loadRecipes() {
    document.querySelector('.recipes__container').setAttribute('data-state', 'load');

    try {
        let id = Math.floor(Math.random() * 4990);
        let jsonRecipes = [];
        for (let i = 0; i < 10; i++) {
            await fetch(`https://jsonplaceholder.typicode.com/photos/${id + i}`)
                .then(response => response.json())
                .then(json => jsonRecipes.push(json));
        }

        document.querySelector('.recipes__container').setAttribute('data-state', '');
        drawRecipes(jsonRecipes);
    } catch (error) {
        handleError(error);
    }
}

function drawRecipes(jsonRecipes) {
    let recipesContainer = document.querySelector('.recipes__container');
    let recipeTemplate = document.querySelector('template#recipe').content;
    
    jsonRecipes.forEach(recipe => {
        let newRecipe = recipeTemplate.cloneNode(true);
        newRecipe.querySelector('img').setAttribute('src', recipe.url);
        newRecipe.querySelector('.recipe__name h2').textContent = recipe.title;
        newRecipe.querySelector('.recipe__category p').textContent = 'Category';
        newRecipe.querySelector('.recipe__time p').textContent = 'Time';
        newRecipe.querySelector('.recipe__favourite p').textContent = recipe.id;
        newRecipe.querySelector('.recipe__favourite .recipe-addition__icon').addEventListener('click', changeFavouriteImg);
        recipesContainer.insertBefore(newRecipe, recipesContainer.querySelector('.preloader'));
    });
}

function handleError(error) {
    console.error("Ошибка: ", error);
    document.querySelector('.recipes__container').setAttribute('data-state', 'error');
}