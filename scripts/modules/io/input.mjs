import {Terminal, InputPrefix, refreshInputPrefix} from './output.mjs';

// This function will redirect all events of the element and category it's
// assigned to and redirect them to targetElement.
function trapFocus (event, targetElement) {
  if (event.target !== targetElement) targetElement.focus({preventScroll: true});
}

// This function is used to pass the contents of an input field as a command.
async function processKeystrokes (key, game, element) {
  if (key.code === 'Enter') execute(game, element);
}

// This function handles the command contained by the element, then clears it.
async function execute (game, element) {
  Terminal.history(new InputPrefix(game).element, element.value);
  game.commandHistory.unshift(element.value)
  let args = element.value.split(' ');
  element.value = '';
  
  // Get the executable file from the player's machine
  let executable = game.localhost.root.children.get('bin').children.get(args[0]);
  
  if (
    executable === undefined ||
    executable.constructor.name !== 'Executable'
  ) { // Catches attempts to run commands that don't exist
    Terminal.error(args[0] + ': command not found.');
  } else {
    executable.run(game, args).then( // Change UI to match new state
      refreshInputPrefix(new InputPrefix(game).element)
    );
  }
}

export {trapFocus, processKeystrokes};