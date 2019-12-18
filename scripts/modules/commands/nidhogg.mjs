import {Terminal, InputPrefix, refreshInputPrefix} from '../io/output.mjs';
import Timer from '../game/timer.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    let target = game.activeMachine;
    if (!game.hardlineActive) {
      Terminal.error(`${args[0]}: Failed - requires an active hardline connection.`);
      return;
    }
    if (target.activeUser === target.users.get('root')) {
      Terminal.error(`${args[0]}: Already root.`);
      return;
    }
    if (!target.securityInfo.canCrack()) {
      Terminal.error(`${args[0]}: Failed - not enough ports are open.`);
      return;
    }
    
    let pid;
    
    Terminal.log(`Attempting to force root priveleges...`);
    let progressBar = Terminal.log(`Progress: [${' '.repeat(20)}]`);
    let runtimeTimer = new Timer(
      game,
      600,
      () => {},
      () => {
        let bar = '#'.repeat(Math.ceil(runtimeTimer.getElapsed() * 20));
        let progress = `Progress: [${bar}${' '.repeat(20 - bar.length)}]`;
        if (progressBar.element.textContent !== progress) progressBar.element.textContent = progress;
      },
      () => {},
      (game) => {
        target.login('root', target.users.get('root').password);
        refreshInputPrefix(new InputPrefix(game).element);
        progressBar.element.textContent = 'Progress: [##### COMPLETE #####]';
        Terminal.log('Root priveleges successfully attained.');
        setTimeout(() => game.processes.killProcess(pid), 5000);
      }
    );
    
    pid = game.processes.addProcess(args[0], runtimeTimer);
    runtimeTimer.start();
  },
  
  help: filename =>
`${filename}: ${filename} (no args)
  Attempts to forcefully gain root priveleges.
  Requires a hardline connection to the target host and a number of open ports.`
}
