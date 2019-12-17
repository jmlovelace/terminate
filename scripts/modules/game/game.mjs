// Ready for a monolith?

// Kehehe.

import MachineSetup from '../../../config/machines.mjs';
import Themes from '../../../config/themes.mjs';
import Terminal from '../io/output.mjs';

// This object holds the game's global state.
class Game {
  constructor (enableVerboseLogging) {
    // Verbose Logging: prints extra data to the console for debugging purposes
    this.verboseLogging = (enableVerboseLogging === true); // force bool true; false otherwise
    
    // DOM stuff
    this.overlay = document.getElementById('terminal-overlay');
    this.themes = Themes;
    this.theme = this.themes.ambient;
    
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
    this.internet = MachineSetup(this);
    
    // Marks the new machine as the user's.
    this.localhost = this.internet.get('127.0.0.1');
    
    // Initializes the user as the machine's admin and sets their directory to
    // the machine's root folder.
    this.localhost.login('root', '');
    this.activeMachine = this.localhost;
    this.activeDirectory = this.localhost.root;
  }
  
  get theme() {
    return this._theme;
  }
  
  set theme(value) {
    this._theme = value;
    document.getElementById('theme').setAttribute('href', this._theme);
  }
  
  win () {
    Terminal.warn("Win!");
  }
  
  lose () {
    Terminal.warn("Lose!");
  }
}

export default Game;
