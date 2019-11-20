import {ANONYMOUS} from '../os/users.mjs';

// Represents an individual computer on the network.
// root should be a Directory representing the filesystem root folder.
class Machine {
  constructor (hostname, ip, rootDirectory, userMap) {
    this.hostname = hostname;
    this.ip = ip;
    this.root = rootDirectory;
    this.users = userMap;   // Holds a username/password map of user credentials
    this.activeUser = ANONYMOUS;
  }
  
  // TODO: Create a more semantic return value for success and failure
  // Attempts to login to the machine with the provided credentials.
  login (username, password) {
    if (this.users.get(username).password === password) {
      this.activeUser = this.users.get(username);
      return true;
    }
    return false;
  }
  
  // Logs out of the machine (by resetting its active user to the default).
  logout () {this.activeUser = ANONYMOUS;}
}

export default Machine;
