import {trapFocus, processKeystrokes as getInput} from './modules/io/input.mjs';
import Game from './modules/game/game.mjs';

let game = new Game();
let termInput;

document.onload = (() => {
  termInput = document.getElementById('terminal-input');
  
  document.onkeydown = (event) => trapFocus(event, termInput);
  termInput.onkeydown = (key) => getInput(key, game, termInput);
})();
