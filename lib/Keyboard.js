// Keyboard event handling.

import $ from 'sprint-js';

const MAX_INPUT_SIZE = 40;
let input = '';
let previousSearch = '';

export function attachKeyboardHandlers() {
  window.addEventListener('keypress', handleKeyPress);
  window.addEventListener('keydown', handleSpecialKeys.bind(this));
}

function handleKeyPress({ key }) {
  if (key === 'Enter' || input.length === MAX_INPUT_SIZE) return;
  input += key;
  renderInput();
}

function handleSpecialKeys({ key }) {
  switch (key) {
    case 'Backspace':
      input = input.slice(0, -1);
      break;

    case 'Escape':
      this.clearSearch();
      hideSearchTerm();
      break;
    
    case 'Enter':
      hideSearchTerm();  
      if (input === '') {
        this.search(previousSearch);
        showSearchTerm(previousSearch);
      } else {
        this.clearSearch();
        this.search(input);
        showSearchTerm(input);
        previousSearch = input;
      }
      input = '';
      break;
  }
  renderInput();
}

function renderInput() {
  $('#search-overlay').empty().append(
    `<div class='search-input'>${ input }</div>`
  );
}

function showSearchTerm(term) {
  $('#main').append(
    `<div id='search-term'>current search: ` +
    `<span class='term'>${ term }</span></div>`
  );
}

function hideSearchTerm() {
  $('#search-term').remove();
}

