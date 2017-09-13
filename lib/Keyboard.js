// Keyboard event handling.

import $ from 'sprint-js';

const MAX_INPUT_SIZE = 40;
let input = '';

function attachKeyboardHandlers() {
  window.addEventListener('keypress', handleKeyPress);
  window.addEventListener('keydown', handleSpecialKeys);
}

export { attachKeyboardHandlers };

function handleKeyPress({ key }) {
  if (key === 'Enter' || input.length === MAX_INPUT_SIZE) return;
  input += key;
  console.log(input);
  renderInput();
}

function handleSpecialKeys({ key }) {
  switch (key) {
    case 'Backspace':
      input = input.slice(0, -1);
      console.log(input);
      renderInput();
      break;
    
    case 'Enter':
      console.log('search!');
      renderInput();
      break;
  }
}

function renderInput() {
  $('#search-overlay').empty().append(
    `<div class='search-input'>${ input }</div>`
  );
}

