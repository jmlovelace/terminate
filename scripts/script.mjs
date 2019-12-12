import {trapFocus, processKeystrokes as getInput} from './modules/io/input.mjs';
import {InputPrefix, refreshInputPrefix} from './modules/io/output.mjs';
import Game from './modules/game/game.mjs';

// Make our state object.
let game = new Game(/* Enable verbose logging: */ true);

// We store this logic here to ensure that all the elements are loaded before
// we try and modify them. Otherwise, they'll likely not exist yet.
document.onload = (() => {
  let termInput = document.getElementById('terminal-input');
  
  // This handler makes it so that any keypresses get passed to termInput.
  document.onkeydown = (event) => trapFocus(event, termInput);
  
  // This handler makes termInput function as the primary input.
  termInput.onkeydown = (key) => getInput(key, game, termInput);
  
  // Initialize our basic UI.
  refreshInputPrefix(new InputPrefix(game).element);
})();
