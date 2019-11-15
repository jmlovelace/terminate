import checkIfEnter as getInput from './scripts/modules/io/input.mjs';
import Game from './scripts/modules/game/game.mjs';

let game = new Game();

document.onload = () => {
  let termInput = document.getElementById('terminal-input');
  termInput.onkeydown = (key) => getInput();
};