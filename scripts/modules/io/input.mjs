import Terminal from './output.mjs';

function trapFocus (event, targetElement) {
  if (event.target !== targetElement) targetElement.focus({preventScroll: true});
}

async function processKeystrokes (key, game, element) {
  if (key.code === 'Enter') execute(game, element);
}

async function execute (game, element) {
  let args = element.value.split(' ');
  element.value = '';
  
  let executable = game.localhost.root.children.get('bin').children.get(args[0]);
  
  if (
    executable === undefined ||
    executable.constructor.name !== 'Executable'
  ) {
    Terminal.error(args[0] + ': command not found.');
  } else {
    executable.run(game, args);
  }
}

export {trapFocus, processKeystrokes};
