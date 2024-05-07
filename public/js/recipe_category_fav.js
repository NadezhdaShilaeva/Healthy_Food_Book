import { filterFavouritesByCategiry, findAllFavourites } from "./filter_favourite_recipes.js";

function changeActiveCategory(event) {
    let elem = event.target;
    let activeClass = 'active';
    if (elem.classList.contains(activeClass)) {
        document.querySelectorAll('.catalog__link').forEach(item => {
            if (item.textContent.trim() === elem.textContent.trim()) {
                item.classList.remove(activeClass);
            }
        });

        findAllFavourites();
    } else {
        document.querySelectorAll('.catalog__link').forEach(item => {
            if (item.textContent.trim() === elem.textContent.trim()) {
                item.classList.add(activeClass);
            } else {
                item.classList.remove(activeClass);
            }
        });

        filterFavouritesByCategiry(mapCategoryToEnum(elem.textContent.trim()));
    }
}

document.querySelectorAll('.catalog__link').forEach(item => {
    item.addEventListener('click', changeActiveCategory);
});

export function mapEnumToCategory(category) {
    switch (category.toLowerCase()) {
        case "snacks": return "Закуски";
        case "salads": return "Салаты";
        case "soups": return "Супы";
        case "fish": return "Рыбные блюда";
        case "meat": return "Мясные блюда";
        case "garnish": return "Гарниры";
        case "desserts": return "Десерты";
        case "drinks": return "Напитки";
        case "kids": return "Детское меню";
    };
}

export function mapCategoryToEnum(category) {
    switch (category) {
        case "Закуски": return "snacks";
        case "Салаты": return "salads";
        case "Супы": return "soups";
        case "Рыбные блюда": return "fish";
        case "Мясные блюда": return "meat";
        case "Гарниры": return "garnish";
        case "Десерты": return "desserts";
        case "Напитки": return "drinks";
        case "Детское меню": return "kids";
    };
}