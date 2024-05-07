(function(){
    window.addEventListener('load', () => {
        const pageEnd = performance.mark('pageEnd');
        const pageloadtime = pageEnd.startTime;

        let loadTimeElem = document.getElementsByClassName('footer__page-load-time')[0];
        loadTimeElem.textContent = `Page load time is ${pageloadtime.toFixed(0)} ms (client)` + loadTimeElem.textContent;
    });
})();