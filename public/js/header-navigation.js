let currentLink = location.pathname;
let currentPath = currentLink.substring(currentLink.indexOf('/'));

document.querySelectorAll('.menu-link').forEach(item => {
    let linkHref = item.getAttribute('href');
    if (currentPath === linkHref) {
        item.classList.add('active');
    }
});