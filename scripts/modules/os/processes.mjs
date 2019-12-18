class Process {
  constructor (processName, processID, runTimer) {
    this.process = processName;
    this.pid = processID;
    this.timer = runTimer;
  }
}

class ProcessList {
  constructor () {
    this.basePID = 41;
    this.processes = [];
  }
  
  addProcess (name, runTimer) {
    let lengthBefore = this.getAllProcesses().length;
    
    let pid = this.processes.indexOf(null);
    if (pid === -1) pid = this.processes.push(null);
    this.processes[pid] = new Process(name, this.basePID + pid, runTimer);
    
    let lengthAfter = this.getAllProcesses().length;
    
    // Scale process runtime to be a fraction of the number of running programs
    for (let p of this.getAllProcesses()) {
      if (p.timer && p.timer.countdown) {
        p.timer.totalDuration = Math.ceil(p.timer.totalDuration / lengthBefore * lengthAfter);
        p.timer.remaining = Math.ceil(p.timer.remaining / lengthBefore * lengthAfter)
      }
    }
    
    return this.basePID + pid;
  }
  
  killProcess (pid) {
    if (this.processes[pid - this.basePID].runTimer) this.processes[pid - this.basePID].runTimer.stop();
    this.processes[pid - this.basePID] = null;
  }
  
  getProcess (pid) {
    return this.processes[pid - this.basePID];
  }
  
  getAllProcesses () {
    return this.processes.filter(p => p !== null);
  }
}

export default ProcessList;
