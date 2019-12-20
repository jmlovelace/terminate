// TODO: add rm, add logging to {crackers, mv, scp}
import {FileException, resolvePath, PermissionOption} from '../os/filesystem.mjs';
import Terminal from '../io/output.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    let path = args[1].trim();
    let all;
    
    if (path[path.length - 1] === '*') {
      all = true;
      path = path.split('*')[0];
    } else {
      all = false;
    }
    
    if (all) {
      if (path === '') path = './';
      
      let dir;
      try {
        dir = resolvePath(game, path, true);
      } catch (e) {
        switch (e) {
          case (FileException.NotExists):
          case (FileException.NotDirectory):
            Terminal.error(
              `${args[0]}: cannot remove contents of '${path}': No such directory`
            );
            return;
          default: // uh oh, this shouldn't happen, throw it up the chain
            throw e;
        }
      }
      
      if (game.activeMachine.activeUser.username !== 'root') {
        let dirPerms = dir.permissions.get(game.activeMachine.activeUser);
        if (dirPerms === undefined) dirPerms = dir.permissions.get(ANONYMOUS);
        
        if (dirPerms.write !== PermissionOption.ALLOWED) {
          Terminal.error(`${args[0]}: Insufficient permissions to remove files from '${path}'`);
          return;
        }
      }
      
      let eligibleFiles = [];
      dir.children.forEach(
        entry => {
          if (entry.constructor.name !== 'Directory') eligibleFiles.push(entry);
        }
      );
      
      Terminal.log(`Removing all files from '${path}'...`);
      let progressBar = Terminal.log('Progress: [                    ]');
      let itemsRemoved = 0;
      
      let runningOn = game.activeMachine;
      
      for (let file of eligibleFiles) {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (game.activeMachine !== runningOn) {
          progressBar.element.textContent = 'Progress: [!!!!! CANCELED !!!!!]';
          Terminal.warn(`${args[0]}: Connection lost -- removal incomplete.`);
          break;
        }
        dir.removeFile(file);
        itemsRemoved++;
        let bar = "#".repeat(Math.ceil(itemsRemoved / eligibleFiles.length * 20));
        let progress = `Progress: [${bar}${' '.repeat(20-bar.length)}]`;
        if (progressBar.element.textContent !== progress) progressBar.element.textContent = progress;
      }
      if (itemsRemoved === eligibleFiles.length) progressBar.element.textContent = 'Progress: [##### COMPLETE #####]';
      Terminal.log('Done removing files.');
      return;
    }
    
    // Single-deletion mode.
    let file;
    try {
      file = resolvePath(game, path);
    } catch (e) {
      switch (e) {
        case (FileException.NotExists):
        case (FileException.NotDirectory):
          Terminal.error(
            `${args[0]}: cannot remove '${path}': No such file`
          );
          return;
        default: // uh oh, this shouldn't happen, throw it up the chain
          throw e;
      }
    }
    
    if (file.constructor.name === 'Directory') {
      Terminal.error(`${args[0]}: cannot remove '${path}': is a directory`);
      return;
    }
    
    if (game.activeMachine.activeUser.username !== 'root') {
      let filePerms = file.permissions.get(game.activeMachine.activeUser);
      if (filePerms === undefined) filePerms = file.permissions.get(ANONYMOUS);
      
      if (filePerms.write !== PermissionOption.ALLOWED) {
        Terminal.error(`${args[0]}: Insufficient permissions to remove '${path}'`);
        return;
      }
    }
    
    file.parent.removeFile(file);
    
    game.missions['Terminal Tutorial'].tryComplete(game);
  },
  
  help: filename =>
`${filename}: ${filename} <file>
  Removes the FILE at the path specified, or every file in the directory if the
  path ends in an asterisk.
  
  e.g.:
    ${filename} *
      will remove every file in the current directory.
    ${filename} junk/*
      will remove every file in the junk directory, which is in the current dir.`
}
