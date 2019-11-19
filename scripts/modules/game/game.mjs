// Ready for a monolith?

// Kehehe.

import Internet from '../network/internet.mjs';
import Machine from '../network/device.mjs';
import * as FileSystem  from '../os/filesystem.mjs';
import {ANONYMOUS} from '../os/users.mjs';
import commands from '../../../config/commands.mjs';

// This helper function will create a basic *NIX file tree.
let rootOnlyPermissions = () => {
  let out = new Map();
  out.set(ANONYMOUS, new FileSystem.Permission(
    FileSystem.PermissionOption.DISALLOWED,
    FileSystem.PermissionOption.DISALLOWED,
    FileSystem.PermissionOption.DISALLOWED,
  ));
  return out;
}

let fileTreeSkeleton = () => {
  let root = new FileSystem.Directory('', rootOnlyPermissions());
  root.addFile(new FileSystem.Directory('bin', rootOnlyPermissions()));
  root.addFile(new FileSystem.Directory('boot', rootOnlyPermissions()));
  root.addFile(new FileSystem.Directory('home', rootOnlyPermissions()));
  root.addFile(new FileSystem.Directory('var', rootOnlyPermissions()));
  root.children.get('var')
    .addFile(new FileSystem.Directory('log', rootOnlyPermissions()));
  return root;
}

class Game {
  constructor () {
    // At first there was nothing. And so the Constructor made the universe.
    this.activeDirectory; // Directory object
    this.activeMachine;   // Machine object
    this.internet;        // Internet object
    this.localhost;       // Machine object
    
    // In the first block, the Constructor created the online world...
    this.internet = new Internet();
    
    // In the second, because It needed a home, it created the local machine.
    this.internet.set(new Machine(
      'localhost',
      '127.0.0.1',
      fileTreeSkeleton(),
      
      // This is an inline function that we run as soon as we declare it.
      // These 5 lines all form a single expression, yielding its return value.
      (()=>{
        let out = new Map();
        out.set('root', '');
        return out;
      })()
    ));
    
    this.localhost = this.internet.get('127.0.0.1');
    
    this.localhost.login('root', '');
    this.activeDirectory = this.localhost.root;
    
    // ...complemented by a beer volcano.
    console.log('Beer volcano successfully deployed.');
    
    // In the third, It created a batch of programs, which it named SUS.
    AddPrograms: {
      // This block is executed just like any other statement, but by using it,
      // we can help avoid cluttering the constructor with more local var names.
      let bin = this.localhost.root.children.get('bin');
      
      bin.children.set('echo', new FileSystem.Executable(
        'echo', rootOnlyPermissions(), 'echo'
      ));
      
      console.log(commands.get('echo'));
    }
    
    
  }
}

export default Game;
