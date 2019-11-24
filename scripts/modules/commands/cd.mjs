import Terminal from '../io/output.mjs';
import {FileException, resolvePath} from '../os/filesystem.mjs';

// This command, cd, changes the current working directory.
export default async function command(game, args) {
  try {
    game.activeDirectory = resolvePath(game, args[1], true);
  } catch (e) {
    switch (e) {
      case (FileException.NotExists):
        Terminal.log(`${args[0]}: ${args[1]}: No such file or directory`);
        break;
      case (FileException.NotDirectory):
        Terminal.log(`${args[0]}: ${args[1]}: Not a directory`);
        break;
      default: // uh oh, this shouldn't happen. toss it up the chain.
        throw e;
    }
    
  }
}
