import Terminal from '../io/output.mjs';
import {FileException, resolvePath, PermissionOption} from '../os/filesystem.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    let path = args[1];
    
    let file;
    try {
      file = resolvePath(game, path);
    } catch (e) {
      switch (e) {
        case (FileException.NotExists):
        case (FileException.NotDirectory):
          Terminal.error(
            `${args[0]}: cannot read '${path}': No such file`
          );
          return;
        default: // uh oh, this shouldn't happen, throw it up the chain
          throw e;
      }
    }

    if (file.constructor.name === 'Directory') {
      Terminal.error(`${args[0]}: cannot read '${path}': is a directory`);
      return;
    }

    if (game.activeMachine.activeUser.username !== 'root') {
      let filePerms = file.permissions.get(game.activeMachine.activeUser);
      if (filePerms === undefined) filePerms = file.permissions.get(ANONYMOUS);
      
      if (filePerms.read !== PermissionOption.ALLOWED) {
        Terminal.error(`${args[0]}: Insufficient permissions to view '${path}'`);
        return;
      }
    }
    
    if (file.constructor.name !== 'TextFile') {
      let binaryDump = `${' '.repeat(79)}\n`.repeat(20).split('\n');
      binaryDump.pop();
      binaryDump = binaryDump.map(str => str.split(' '));
      Terminal.log(binaryDump.map(arr => arr.map(str => Math.round(Math.random())).join('')).join('\n'));
      return;
    }
    
    Terminal.log(file.text);
  },
  
  help: filename =>
`${filename}: ${filename} <path>
  Prints the contents of the specified file to the console.`
}
