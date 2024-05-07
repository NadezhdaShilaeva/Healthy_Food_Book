const instructionTemplate = document.getElementById('description').content;
var instructionForm = document.querySelector('.instruction-form');

if (instructionForm.querySelectorAll('.form-item__description').length == 0) {
    let instructionTemplate1 = instructionTemplate.cloneNode(true);
    instructionTemplate1.querySelector('.description__title').textContent = 'Шаг 1:';
    let textareaTemplate1 = instructionTemplate1.querySelector('.parameter__input__textarea');
    textareaTemplate1.setAttribute('name', 'step1');
    textareaTemplate1.setAttribute('required', '');
    instructionForm.appendChild(instructionTemplate1);
}

if (instructionForm.querySelectorAll('.form-item__description').length == 1) {
    let instructionTemplate2 = instructionTemplate.cloneNode(true);
    instructionTemplate2.querySelector('.description__title').textContent = 'Шаг 2:';
    let textareaTemplate2 = instructionTemplate2.querySelector('.parameter__input__textarea');
    textareaTemplate2.setAttribute('name', 'step2');
    textareaTemplate2.setAttribute('placeholder', 'Описание шага (нажмите Enter чтобы добавить шаг)');
    instructionForm.appendChild(instructionTemplate2);
}

var steps = instructionForm.querySelectorAll('.form-item__description');
var stepCounter = steps.length;

steps[0].addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

steps[1].addEventListener('keypress', createNewTextarea);

for (let i = 2; i < stepCounter; ++i) {
    steps[i].addEventListener('keypress', createNewTextarea);
    steps[i].addEventListener('keydown', removeTextarea);
}

function createNewTextarea(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        if (event.target === instructionForm.lastElementChild.querySelector('.parameter__input__textarea')) {
            createNewTextArea();
        }
    }
}

export function createNewTextArea() {
    stepCounter++;
            
    let lastTextarea = instructionForm.lastElementChild.querySelector('.parameter__input__textarea');
    lastTextarea.setAttribute('placeholder', 'Описание шага');

    let instructionTemplatei = instructionTemplate.cloneNode(true);
    instructionTemplatei.querySelector('.description__title').textContent = `Шаг ${stepCounter}:`;
    let textareaTemplatei = instructionTemplatei.querySelector('.parameter__input__textarea');
    textareaTemplatei.setAttribute('name', `step${stepCounter}`);
    textareaTemplatei.setAttribute('placeholder', 'Описание шага (нажмите Enter чтобы добавить шаг)');
    instructionForm.appendChild(instructionTemplatei);

    textareaTemplatei.addEventListener('keypress', createNewTextarea);
    textareaTemplatei.addEventListener('keydown', removeTextarea);
}

function removeTextarea(event) {
    if (event.key === 'Backspace' && 
        event.target === instructionForm.lastElementChild.querySelector('.parameter__input__textarea') && 
        event.target.value === '') {
        stepCounter--;
        instructionForm.removeChild(instructionForm.lastElementChild);

        lastTextarea = instructionForm.lastElementChild.querySelector('.parameter__input__textarea');
        lastTextarea.setAttribute('placeholder', 'Описание шага (нажмите Enter чтобы добавить шаг)');
    }
}