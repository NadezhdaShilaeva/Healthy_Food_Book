// метод selectize из библиотеки Selectize.js инициализирует Selectize 
// с использованием существующего <select id="multi-select"> элемента.
var $multiSelect = $('#multi-select').selectize({ 
    // параметр placeholder задает заполнитель элемента управления (.selectize-control). 
    // (отображается, когда ничего не выбрано/введено)
    placeholder: 'Любые ингредиенты',
    // парамметр respect_word_boundaries со значением false необходим для
    // возможности поиска схожих слов на русском языке.
    respect_word_boundaries: false,
    // параметр create позволяет пользователю создавать новые элементы, 
    // которых нет в исходном списке параметров.
    create: true,
    // если параметр persist установлен в значение false, то элементы, 
    // созданные пользователем, не будут отображаться в качестве доступных 
    // опций, если они не выбраны.
    persist: false,
    // параметр maxOptions задает максимальное количество элементов, 
    /// отображаемых одновременно, в раскрывающемся списке параметров.
    maxOptions: null,
    // параметр maxItems задает максимальное количество элементов, 
    // которые может выбрать пользователь.
    // null допускает неограниченное количество элементов.
    maxItems: null,
    // параметр onInitialize задает функцию, которая вызывается после 
    // полной инициализации элемента управления.
    // функция setAutocomleteOff устанавливает аттрибут "autocomplete" 
    // элемента input в значение "off".
    onInitialize: setAutocomleteOff
});

function setAutocomleteOff() {
    $('.selectize-input>input').attr('autocomplete', 'off');
}