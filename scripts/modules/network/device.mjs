import {ANONYMOUS} from '../os/users.mjs'

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
  
  login (username, password) {
    if ()
  }
}