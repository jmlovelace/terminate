import {Terminal, InputPrefix, refreshInputPrefix} from './output.mjs';

// This function will redirect all events of the element and category it's
// assigned to and redirect them to targetElement.
function trapFocus (event, targetElement) {
  if (event.target !== targetElement) targetElement.focus({preventScroll: true});
}

// This function is used to pass the contents of an input field as a command.
async function processKeystrokes (key, game, element) {
  if (!(game.music.hasPlaying)) game.music.play('ambient');
  if (key.code === 'Enter' && element.value !== '') execute(game, element);
  if (key.code === 'ArrowUp') browseHistory(game, element, 1);
  if (key.code === 'ArrowDown') browseHistory(game, element, -1);
}

// This function allows a user to navigate their previous commands.
function browseHistory (game, element, addToIndex) {
  game.commandHistoryIndex += addToIndex;
  
  if (game.commandHistoryIndex < -1) game.commandHistoryIndex = -1;
  if (game.commandHistoryIndex >= game.commandHistory.length) game.commandHistoryIndex = game.commandHistory.length - 1;
  
  if (game.commandHistoryIndex === -1) {
    element.value = '';
  } else {
    element.value = game.commandHistory[game.commandHistoryIndex];
  }
}

// This function handles the command contained by the element, then clears it.
async function execute (game, element) {
  Terminal.history(new InputPrefix(game).element, element.value);
  game.commandHistory.unshift(element.value); // Add to the beginning
  game.commandHistoryIndex = -1; // Reset
  let args = element.value.split(' ');
  element.value = '';
  
  // Get the executable file from the player's machine
  let executable = game.localhost.root.children.get('bin').children.get(args[0]);
  
  if (
    executable === undefined ||
    executable.constructor.name !== 'Executable'
  ) { // Catches attempts to run commands that don't exist
    Terminal.error(args[0] + ': command not found.');
    refreshInputPrefix(new InputPrefix(game).element) // just to scroll proper
  } else {
    executable.run(game, args).then( // Change UI to match new state
      refreshInputPrefix(new InputPrefix(game).element)
    );
  }
}

export {trapFocus, processKeystrokes};
