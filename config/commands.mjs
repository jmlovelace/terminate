// Import the commands from ../scripts/modules/commands here.
import echo from '../scripts/modules/commands/echo.mjs'
import cd from '../scripts/modules/commands/cd.mjs'

// This'll hold all the game's user-executable commands by name.
let commands = (function() {
  let out = new Map();
  
  // Add commands to the command dictionary here.
  out.set('echo', echo);
  out.set('cd', cd);
  
  return out;
})();

export default commands;
