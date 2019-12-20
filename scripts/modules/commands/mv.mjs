import Terminal from '../io/output.mjs';
import {FileException, resolvePath, PermissionOption} from '../os/filesystem.mjs';
import {ANONYMOUS} from '../os/users.mjs';

let command;
// This command, mv, moves a file in one path to a different path.
export default command = {
  execute: async (game, args) => {
    let source;
    let dest;
    let destName;
    
    try {
      source = resolvePath(game, args[1]);
    } catch (e) {
      switch (e) {
        case (FileException.NotExists):
        case (FileException.NotDirectory):
          Terminal.log(`${args[0]}: cannot stat '${args[1]}': No such file or directory`);
          return;
        default: // uh oh, this shouldn't happen, throw it up the chain
          throw e;
      }
    }
    
    try {
      dest = args[2].split('/');
      destName = dest.pop();
      if (dest.length === 0) dest = '.';
      dest = resolvePath(game, dest.join('/'));
      if (dest === null) dest = resolvePath(game, '/');
      console.log(dest, destName);
      if (dest.children.get(destName) && dest.children.get(destName).constructor.name === 'Directory') {
        dest = dest.children.get(destName);
        destName = source.filename;
      }
    } catch (e) {
      switch (e) {
        case (FileException.NotExists):
        case (FileException.NotDirectory):
          Terminal.log(`${args[0]}: cannot move '${args[1]}' to '${args[2]}': No such file or directory`);
          return;
        default: // uh oh, this shouldn't happen, throw it up the chain
          throw e;
      }
    }
    
    if (game.activeMachine.activeUser.username !== 'root') {
      let sourcePerms = source.permissions.get(game.activeMachine.activeUser);
      if (sourcePerms === undefined) sourcePerms = source.permissions.get(ANONYMOUS);
      let destPerms = dest.permissions.get(game.activeMachine.activeUser);
      if (destPerms === undefined) destPerms = source.permissions.get(ANONYMOUS);
      
      if (sourcePerms.write !== PermissionOption.ALLOWED) {
        Terminal.error(`${args[0]}: Insufficient permissions to modify '${args[1]}'`);
        return;
      } else if (destPerms.write !== PermissionOption.ALLOWED) {
        Terminal.error(`${args[0]}: Insufficient permissions to modify '${args[2]}'`);
        return;
      }
    }
    
    console.log(destName);
    
    source.parent.removeFile(source);
    source.filename = destName;
    dest.addFile(source);
  },

  help: (filename) =>
`${filename}: ${filename} <source> <dest>
  Renames SOURCE to DEST, or moves SOURCE to the directory specified by DEST.`

}
