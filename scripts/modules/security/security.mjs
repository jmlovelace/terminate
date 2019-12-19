import Timer from '../game/timer.mjs';
import Terminal from '../io/output.mjs';

class Port {
  constructor(service, number) {
    this.service = service;
    this.number = number;
    this.open = false;
  }
}

class PortMap {
  constructor (portDict) {
    this.ports = new Map();
    this.ports.set('ftp', new Port('ftp', 0));           // Default port number:   21
    this.ports.set('ssh', new Port('ssh', 0));           // Default port number:   22
    this.ports.set('smtp', new Port('smtp', 0));         // Default port number:   25
    this.ports.set('http', new Port('http', 0));         // Default port number:   80
    this.ports.set('ssl', new Port('ssl', 0));           // Default port number:  443
    this.ports.set('sql', new Port('sql', 0));           // Default port number: 1433
    this.ports.set('torrent', new Port('torrent', 0));   // Default port number: 6881
    
    if (portDict !== undefined) this.setList(portDict);
  }
  
  setPort (service, number) {
    if (this.ports.get(service) !== undefined) this.ports.set(service, new Port(service, number));
  }
  
  setList (portDict) { // Takes an object with services as keys and port #s as vals
    for (let service of Object.keys(portDict)) {
      this.setPort(service, portDict[service]);
    }
  }
  
  getPort (service) {
    return this.ports.get(service);
  }
  
  getPorts () {
    let out = [];
    
    for (let portKey of this.ports.keys()) {
      let port = this.ports.get(portKey);
      if (port.number) out.push(port); // all nonzero ports
    }
    
    return out;
  }
  
  countOpen () {
    let out = 0;
    for (let portKey of this.ports.keys()) {
      let port = this.ports.get(portKey);
      if (port.number && port.open) out++; // all nonzero open ports
    }
    return out;
  }
  
  refresh () { // Closes all ports
    for (let portKey of this.ports.keys()) {
      this.ports.get(portKey).open = false;
    }
  }
}

const activateHardline = game => {
  game.theme = 'hardline';
  game.hardlineActive = true;
}

const deactivateHardline = game => {
  // cover your trail. game.activeMachine should be a given SecurityInfo's parent.
  let target = game.activeMachine;
  if (target.hasDangerousLogs()) setTimeout(
    () => target.securityInfo.onCaught(game),
    Math.floor(Math.random() * 5000) + 5000
  );
  
  Terminal.warn('-- hardline disconnected --');
  
  game.hardlineActive = false;
  game.overlay.textContent = '';
  game.theme = 'ambient';
}

class SecurityInfo {
  constructor (game, seconds, portMap, portsNeeded, onCaught) {
    this.timer = new Timer(
      game,
      seconds * 100,
      activateHardline,
      game => game.overlay.innerText = (this.timer.remaining / 100).toFixed(2),
      deactivateHardline,
      game => this.onCaught(game)
    );
    
    this.seconds = seconds;
    this.ports = portMap;
    this.portsNeeded = portsNeeded; // minimum count of open ports to start crack
    this.onCaught = onCaught; // what to do if the hardline expires and/or dirty logs are left
  }
  
  startHardline () {
    this.refresh();
    this.timer.start();
  }
  
  stopHardline () {
    this.timer.stop();
    this.refresh();
  }
  
  refreshTimer () {
    this.timer.remaining = this.seconds * 100;
  }
  
  refresh () {
    this.refreshTimer();
    this.ports.refresh();
  }
  
  canCrack () {
    return this.ports.countOpen() >= this.portsNeeded;
  }
}

export default SecurityInfo;
export {SecurityInfo, PortMap}
