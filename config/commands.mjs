let commands = (() => {
  let out = new Map();
  
  // List each command's name here and the game will handle the rest.
  let commandNames = [
    'echo'
  ];
  // Imports every command's logic by their names. We want to make sure this only
  // runs once.
  for (let item of commandNames) {
    commands.set(item,
      import(`scripts/modules/commands/${}.mjs`).then(cmd => cmd.command)
    );
  }
})();

export default commands;