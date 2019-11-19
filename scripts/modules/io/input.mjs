function lockFocus (element) {
  element.focus({preventScroll: true});
}

async function checkIfEnter (key, game, element) {
  if (key.code === 'Enter') execute(game, element);
}

async function execute (game, element) {
  let args = element.value.split(' ');
  element.value = '';
  
  let executable = game.localhost.root.children.get('bin').get(args[0]);
  
  if (
    executable === undefined ||
    executable.constructor.name !== 'Executable'
  ) {
    Terminal.error(args[0] + ': command not found.');
  }
  
  executable.run(game, args);
}

export {checkIfEnter};