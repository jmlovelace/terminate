import {ANONYMOUS} from '../os/users.mjs';

// Represents an individual computer on the network.
// root should be a Directory representing the filesystem root folder.
class Machine {
  constructor (hostname, ip, rootDirectory, userMap) {
    this.hostname = hostname;
    this.ip = ip;
    this.root = rootDirectory;
    this.users = userMap;
    this.activeUser = ANONYMOUS;
  }
  
  // TODO: Create a more semantic return value for success and failure
  login (username, password) {
    if (this.users.get(username).password === password) {
      this.activeUser = users.get(username);
      return true;
    }
    return false;
  }
  
  logout () {this.activeUser = ANONYMOUS;}
}

export default Machine;
