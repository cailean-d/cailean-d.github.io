$(document).ready(function() {
    $('#a').select2({
        templateResult: formatState,
        minimumResultsForSearch: -1,
        dropdownParent: $('#b'),
        data: [
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
            { id: 'x', text: 'Тест', q: 'ss'},
        ]
    })
})

function formatState (state) {
    if (!state.id) { return state.text; }
    return $(`<span>${state.text}</span>`);
};

$('#a').on('select2:open', function (e) { 
    $('#b .select2-dropdown').append('<div class="dropdown-header"> dropdown footer<div>');
    $('#b .select2-dropdown').prepend('<div class="dropdown-footer"> dropdown header<div>');
    $('#a').off('select2:open');
});