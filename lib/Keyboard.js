// Keyboard event handling.

import $ from 'sprint-js';

const MAX_INPUT_SIZE = 40;
let input = '';

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
      console.log(input);
      break;
    
    case 'Enter':
      this.search(input);
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

