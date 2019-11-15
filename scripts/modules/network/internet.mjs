// yep, the whole thing.
class Internet {
  constructor () {
    this.dns = new Map();
    this.machines = new Map();
  }
  
  set (machine) {
    this.machines.set(machine.ip, machine);
    this.dns.set(machine.hostname, machine.ip);
  }
  
  get (ip) {
    return this.machines.get(ip);
  }
  
  resolve (hostname) {
    return this.dns.get(hostname);
  }
}

export default Internet;