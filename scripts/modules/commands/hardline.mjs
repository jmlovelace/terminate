import Terminal from '../io/output.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    if (args[1] === '--disconnect' || args[1] === '-d') {
      if (!game.hardlineActive) {
        Terminal.error(`${args[0]}: No hardline connection to close`);
        return;
      }
      game.activeMachine.securityInfo.stopHardline();
      game.activeMachine.disconnect(game);
      return;
    }
    let target = (args[1]) ? game.internet.get(args[1]) : game.activeMachine;
    if (!target) target = game.internet.get(game.internet.resolve(args[1]));
    
    if (!target) {
      Terminal.log(`${args[0]}: Could not establish connection to '${args[1]}'`);
      return;
    }
    
    target.connect(game);
    target.securityInfo.startHardline();
  },
  
  help: filename =>
`${filename}: ${filename} <[hostname|ip]|[--disconnect|-d]>
  Establishes a hardline connection to a given host, or closes the active one.
  
  Specify either the hostname or the IP of the machine to open a hardline to it,
  or --disconnect (abbrev. -d) to close the currently active hardline.`
}
