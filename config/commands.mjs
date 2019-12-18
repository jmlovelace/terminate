// Import the commands from ../scripts/modules/commands here.
import brutessh from '../scripts/modules/commands/brutessh.mjs'
import cd from '../scripts/modules/commands/cd.mjs';
import clear from '../scripts/modules/commands/clear.mjs';
import echo from '../scripts/modules/commands/echo.mjs';
import hardline from '../scripts/modules/commands/hardline.mjs';
import help from '../scripts/modules/commands/help.mjs';
import ls from '../scripts/modules/commands/ls.mjs';
import mv from '../scripts/modules/commands/mv.mjs';
import nidhogg from '../scripts/modules/commands/nidhogg.mjs';
import nmap from '../scripts/modules/commands/nmap.mjs';

// This'll hold all the game's user-executable commands by name.
let commands = (() => {
  let out = new Map();
  
  // Add commands to the command dictionary here.
  out.set('brutessh', brutessh);
  out.set('cd', cd);
  out.set('clear', clear);
  out.set('echo', echo);
  out.set('hardline', hardline);
  out.set('help', help)
  out.set('ls', ls);
  out.set('mv', mv);
  out.set('nidhogg', nidhogg);
  out.set('nmap', nmap);
  
  return out;
})();

export default commands;
