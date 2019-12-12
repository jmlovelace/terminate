// Ready for a monolith?

// Kehehe.

import Internet from '../network/internet.mjs';
import Machine from '../network/device.mjs';
import * as FileSystem  from '../os/filesystem.mjs';
import {User, ANONYMOUS} from '../os/users.mjs';
import commands from '../../../config/commands.mjs';
import themes from '../../config/themes.mjs';

// This helper creates a file permissions map that locks everything by default.
let rootOnlyPermissions = () => {
  let out = new Map();
  out.set(ANONYMOUS, new FileSystem.Permission(
    FileSystem.PermissionOption.DISALLOWED,
    FileSystem.PermissionOption.DISALLOWED,
    FileSystem.PermissionOption.DISALLOWED,
  ));
  return out;
}

// This helper function will create a basic *NIX-like file tree.
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

// This object holds the game's global state.
class Game {
  constructor (enableVerboseLogging) {
    // Verbose Logging: prints extra data to the console for debugging purposes
    this.verboseLogging = (enableVerboseLogging === true); // force bool true; false otherwise
    
    // DOM stuff
    this.overlay = document.getElementById('terminal-overlay');
    this.theme = themes.default;
    
    // Set initial state variables
    this.activeDirectory;     // Directory object
    this.activeMachine;       // Machine object
    this.commandHistory;      // Array
    this.commandHistoryIndex; // Int
    this.internet;            // Internet object
    this.localhost;           // Machine object
    
    // Initialize the game's command history, which will hold user inputs
    this.commandHistory = [];
    this.commandHistoryIndex = -1;
    
    // Initialize the game's Internet object, which will hold its machines
    this.internet = new Internet();
    
    // Populates the Internet object with the user's local machine
    this.internet.set(new Machine(
      'localhost',
      '127.0.0.1',
      fileTreeSkeleton(),
      
      // This is an inline function that we run as soon as we declare it.
      // These 5 lines all form a single expression, yielding its return value.
      (()=>{
        let out = new Map();
        out.set('root', new User('root', ''));
        return out;
      })()
    ));
    
    // Marks the new machine as the user's.
    this.localhost = this.internet.get('127.0.0.1');
    
    // Initializes the user as the machine's admin and sets their directory to
    // the machine's root folder.
    this.localhost.login('root', '');
    this.activeMachine = this.localhost;
    this.activeDirectory = this.localhost.root;
    
    // Loads the user's initial commands onto their machine.
    let bin = this.localhost.root.children.get('bin');
    
    bin.addFile(new FileSystem.Executable('echo', rootOnlyPermissions(), 'echo'));
    bin.addFile(new FileSystem.Executable('cd', rootOnlyPermissions(), 'cd'));
    bin.addFile(new FileSystem.Executable('ls', rootOnlyPermissions(), 'ls'));
    bin.addFile(new FileSystem.Executable('mv', rootOnlyPermissions(), 'mv'));
  }
  
  win () {}
  
  lose () {}
}

export default Game;
