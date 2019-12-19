// Import the commands from ../scripts/modules/commands here.
import cat from '../scripts/modules/commands/cat.mjs';
import cd from '../scripts/modules/commands/cd.mjs';
import clear from '../scripts/modules/commands/clear.mjs';
import echo from '../scripts/modules/commands/echo.mjs';
import ftpbounce from '../scripts/modules/commands/ftpbounce.mjs';
import hardline from '../scripts/modules/commands/hardline.mjs';
import help from '../scripts/modules/commands/help.mjs';
import httpspoof from '../scripts/modules/commands/httpspoof.mjs';
import ls from '../scripts/modules/commands/ls.mjs';
import mv from '../scripts/modules/commands/mv.mjs';
import nidhogg from '../scripts/modules/commands/nidhogg.mjs';
import nmap from '../scripts/modules/commands/nmap.mjs';
import rm from '../scripts/modules/commands/rm.mjs';
import scp from '../scripts/modules/commands/scp.mjs';
import smtprelay from '../scripts/modules/commands/smtprelay.mjs';
import sqlcorrupt from '../scripts/modules/commands/sqlcorrupt.mjs';
import sshbrute from '../scripts/modules/commands/sshbrute.mjs';
import sslbleed from '../scripts/modules/commands/sslbleed.mjs';
import torrentpoison from '../scripts/modules/commands/torrentpoison.mjs';

// This'll hold all the game's user-executable commands by name.
let commands = (() => {
  let out = new Map();
  
  // Add commands to the command dictionary here.
  out.set('cat', cat)
     .set('cd', cd)
     .set('clear', clear)
     .set('echo', echo)
     .set('ftpbounce', ftpbounce)
     .set('hardline', hardline)
     .set('help', help)
     .set('httpspoof', httpspoof)
     .set('ls', ls)
     .set('mv', mv)
     .set('nidhogg', nidhogg)
     .set('nmap', nmap)
     .set('rm', rm)
     .set('scp', scp)
     .set('smtprelay', smtprelay)
     .set('sqlcorrupt', sqlcorrupt)
     .set('sshbrute', sshbrute)
     .set('sslbleed', sslbleed)
     .set('torrentpoison', torrentpoison);
  
  return out;
})();

export default commands;
