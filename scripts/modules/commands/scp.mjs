import Terminal from '../io/output.mjs';
import {FileException, resolvePath, PermissionOption} from '../os/filesystem.mjs';
import {ANONYMOUS} from '../os/users.mjs';

let command;
// This command, mv, moves a file in one path to a different path.
export default command = {
  execute: async (game, args) => {
    if (game.activeMachine === game.localhost) {
      Terminal.error(`${args[0]}: Cannot download file from own machine`);
      return;
    }
    
    let source;
    
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
    
    if (game.activeMachine.activeUser.username !== 'root') {
      let filePerms = source.permissions.get(game.activeMachine.activeUser);
      if (filePerms === undefined) filePerms = source.permissions.get(ANONYMOUS);
      
      if (filePerms.read !== PermissionOption.ALLOWED) {
        Terminal.error(`${args[0]}: Insufficient permissions to download file ${args[1]}`);
        return;
      }
    }
    
    if (source.constructor.name === 'Directory') {
      Terminal.error(`${args[0]}: Cannot download ${args[1]}: is a directory`);
      return;
    }
    
    game.localhost.root.children.get('home').children.get('downloads').addFile(source.copyOf());
  },

  help: (filename) =>
`${filename}: ${filename} <source>
  Downloads the file at the specified SOURCE on the current host to the local
  /home/downloads/ directory.`

}