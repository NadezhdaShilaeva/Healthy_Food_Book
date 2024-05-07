let categoryTemplate = document.querySelector('template#catalog').content;
document.querySelector('aside.main-content__catalog').appendChild(categoryTemplate.cloneNode(true));
document.querySelector('.catalog .catalog__description').appendChild(categoryTemplate.cloneNode(true));