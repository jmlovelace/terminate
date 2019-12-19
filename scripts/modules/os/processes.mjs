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
    let oLen = this.getAllProcesses().length;
    
    if (oLen < 1) oLen = 1;
    
    let pid = this.processes.indexOf(null);
    if (pid === -1) pid = this.processes.push(null);
    
    this.processes[pid] = new Process(name, this.basePID + pid, runTimer);
    this.processes[pid].timer.totalDuration *= oLen;
    this.processes[pid].timer.remaining *= oLen;
    
    let nLen = this.getAllProcesses().length;
    
    this.updateProcessTimers(oLen, nLen);
    
    return this.basePID + pid;
  }
  
  updateProcessTimers (lengthBefore, lengthAfter) {
    // Scale process runtime to be a fraction of the number of running programs
    for (let p of this.getAllProcesses()) {
      if (p.timer) {
        p.timer.totalDuration = Math.ceil(p.timer.totalDuration / lengthBefore * lengthAfter);
        p.timer.remaining = Math.ceil(p.timer.remaining / lengthBefore * lengthAfter)
      }
    }
  }
  
  killProcess (pid) {
    let oLen = this.getAllProcesses().length;
    let p = this.processes[pid - this.basePID];
    if (p === null) return;
    if (p.runTimer) p.runTimer.stop();
    this.processes[pid - this.basePID] = null;
    this.updateProcessTimers(oLen, oLen - 1);
  }
  
  getProcess (pid) {
    return this.processes[pid - this.basePID];
  }
  
  getAllProcesses () {
    return this.processes.filter(p => p !== null);
  }
}

export default ProcessList;
