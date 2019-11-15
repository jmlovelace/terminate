// Ready for a monolith?

// Kehehe.

import Internet from './scripts/modules/network/internet.mjs';
import Machine from './scripts/modules/network/device.mjs';
import * from './scripts/modules/os/filesystem.mjs';
import ANONYMOUS from './scripts/modules/os/users.mjs';
import commands from './config/commands.mjs';

// This helper function will create a basic *NIX file tree.
let rootOnlyPermissions = () => {
  let out = new Map();
  out.set(ANONYMOUS, new Permission(
    PermissionOption.DISALLOWED,
    PermissionOption.DISALLOWED,
    PermissionOption.DISALLOWED,
  ));
  return out;
}

let fileTreeSkeleton = () => {
  let root = new Directory('', rootOnlyPermissions());
  root.addFile(new Directory('bin', rootOnlyPermissions()));
  root.addFile(new Directory('boot', rootOnlyPermissions()));
  root.addFile(new Directory('home', rootOnlyPermissions()));
  root.addFile(new Directory('var', rootOnlyPermissions()));
    root.children.get('var').addFile(new Directory('log', rootOnlyPermissions()));
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
      let bin = localhost.get('').children.get('bin');
      
      bin.children.set('echo', new Executable(
        'echo', rootOnlyPermissions(), commands.echo
      ));
    }
    
    
  }
}

export default Game;