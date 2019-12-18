import Terminal from '../io/output.mjs';
import {FileException, resolvePath, getPathOf} from '../os/filesystem.mjs';

let command;
// This command, cd, changes the current working directory.
export default command = {
  execute: async (game, args) => {
    try {
      game.activeDirectory = resolvePath(game, args[1], true);
      
      game.activeMachine.addLog(
        game,
        'access',
        `${game.localhost.ip}: accessed ${getPathOf(game.activeDirectory)}`,
        false
      );
    } catch (e) {
      switch (e) {
        case (FileException.NotExists):
          Terminal.log(`${args[0]}: ${args[1]}: No such file or directory`);
          return;
        case (FileException.NotDirectory):
          Terminal.log(`${args[0]}: ${args[1]}: Not a directory`);
          return;
        default: // uh oh, this shouldn't happen. toss it up the chain.
          throw e;
      }
    }
  },

  help: filename =>
`${filename}: ${filename} <path>
  Change the shell working directory.
  
  path: The path to the new directory.`
}
