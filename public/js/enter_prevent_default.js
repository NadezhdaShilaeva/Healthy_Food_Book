document.querySelectorAll('input').forEach(item => {
    item.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
});