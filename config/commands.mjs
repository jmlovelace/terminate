// Import the commands from ../scripts/modules/commands here.
import cd from '../scripts/modules/commands/cd.mjs';
import echo from '../scripts/modules/commands/echo.mjs';
import hardline from '../scripts/modules/commands/hardline.mjs';
import ls from '../scripts/modules/commands/ls.mjs';
import mv from '../scripts/modules/commands/mv.mjs';

// This'll hold all the game's user-executable commands by name.
let commands = (function() {
  let out = new Map();
  
  // Add commands to the command dictionary here.
  out.set('cd', cd);
  out.set('echo', echo);
  out.set('hardline', hardline)
  out.set('ls', ls);
  out.set('mv', mv);
  
  return out;
})();

export default commands;
