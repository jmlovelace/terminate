import {ANONYMOUS} from '../os/users.mjs';
import {TextFile} from '../os/filesystem.mjs';

// Represents an individual computer on the network.
// root should be a Directory representing the filesystem root folder.
class Machine {
  constructor (hostname, ip, rootDirectory, userMap, securityInfo) {
    this.hostname = hostname;
    this.ip = ip;
    this.root = rootDirectory;
    this.users = userMap; // Holds a username/password map of user credentials
    this.activeUser = ANONYMOUS;
    this.securityInfo = securityInfo;
  }
  
  // TODO: Create a more semantic return value for success and failure
  // Attempts to login to the machine with the provided credentials.
  login (game, username, password) {
    if (this.users.get(username).password === password) {
      this.activeUser = this.users.get(username);
      this.addLog(game, 'auth', `${game.localhost.ip}: logged in as ${username}`, username === 'root');
      return true;
    }
    return false;
  }
  
  // Logs out of the machine (by resetting its active user to the default).
  logout () {
    this.activeUser = ANONYMOUS;
  }
  
  connect (game) {
    game.activeMachine = this;
    game.activeDirectory = this.root;
    this.addLog(game, 'connection', `Connection established from ${game.localhost.ip}`, false);
  }
  
  disconnect (game) {
    this.logout();
    this.addLog(game, 'connection', `Connection from ${game.localhost.ip} closed`, false);
    this.securityInfo.refresh();
    game.localhost.connect(game);
    game.localhost.login(game, 'root', '');
  }
  
  addLog (game, action, text, dangerous) {
    let logD = this.root.children.get('var').children.get('log');
    logD.addFile(new TextFile(
      `${Date.now()}-${action}-${game.localhost.ip}${dangerous ? 'd':''}.log`,
      new Map().set(ANONYMOUS, logD.permissions.get(ANONYMOUS)),
      text
    ));
  }
  
  hasDangerousLogs () {
    let logD = this.root.children.get('var').children.get('log');
    for (let filename of logD.children.keys()) {
      if (filename[filename.length - 5] === 'd') {
        return true;
      }
    }
    return false;
  }
}

export default Machine;
