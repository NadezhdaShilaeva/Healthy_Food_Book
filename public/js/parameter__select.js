const selectors = document.querySelectorAll('.parameter__select');
const selectOptions = document.querySelectorAll('.parameter__option');

selectors.forEach(select => {select.addEventListener('click', changeState);});

function changeState(event) {
    let select = event.target;
    let selectBox = select.parentNode;

    if ('active' === select.dataset.state) {
      select.setAttribute('data-state', '');
      selectBox.setAttribute('data-state', '');
    } else {
      select.setAttribute('data-state', 'active');
      selectBox.setAttribute('data-state', 'active');
    }
    
}

for (let i = 0; i < selectOptions.length; i++) {
  selectOptions[i].addEventListener('click', changeOption);
}

function changeOption(event) {
    event.stopPropagation();

    changeSelectTitle(event.target);    
}

export function changeSelectTitle(targetElemetnt) {
    let select = targetElemetnt.parentNode.parentNode;
    let selectBox = select.parentNode;
    let selectTitle = select.querySelector('.select__title');

    if (targetElemetnt.matches('label')) {
        selectTitle.textContent = targetElemetnt.textContent.trim();
        selectTitle.style.color = '#3F612A';
        select.setAttribute('data-state', '');
        selectBox.setAttribute('data-state', '');
    }
}

document.addEventListener('click', (event) => {
    selectors.forEach(select => {
      if (event.target !== select) {
        select.setAttribute('data-state', '');
        select.parentNode.setAttribute('data-state', '');
      }
    });
});

const reset = document.querySelector('.reset');
if (reset !== null) {
  reset.addEventListener('click', resetParameterSelect);
}

export function resetParameterSelect() {
  selectors.forEach(select => {
    let selectTitle = select.querySelector('.select__title');
    selectTitle.textContent = selectTitle.getAttribute('data-default');
    selectTitle.style.color = '';
  });
}