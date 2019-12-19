import Terminal from '../io/output.mjs';
import Timer from '../game/timer.mjs';

const crackPort = async (game, cmdName, service, port, attackName, runDuration, spindownDuration) => {
  if (!game.hardlineActive) {
    Terminal.error(`${cmdName}: Failed - requires an active hardline connection.`);
    return;
  }
  
  let target = game.activeMachine;
  let activePort = target.securityInfo.ports.getPort(service);
  
  if (Number(port) === 0 || Number(port) !== activePort.number) {
    Terminal.error(`${cmdName}: Port ${port} does not have a listening ${service} service active.`);
    return;
  }
  if (activePort.open) {
    Terminal.error(`${cmdName}: Port ${port} is already open.`);
    return;
  }
  
  let pid;
  
  Terminal.log(`Beginning ${attackName} attack on ${service} port ${port}...`);
  let progressBar = Terminal.log(`Progress: [${' '.repeat(20)}]`);
  let runtimeTimer = new Timer(
    game,
    runDuration * 100,
    () => {},
    () => {
      if (game.activeMachine !== target) {
        progressBar.element.textContent = 'Progress: [!!!!! CANCELED !!!!!]';
        Terminal.error(`${cmdName}: Connection lost.`);
        runtimeTimer.stop();
        runtimeTimer.remaining = 1; // keeps onExpire from firing
        return;
      }
      
      let bar = '#'.repeat(Math.ceil(runtimeTimer.getElapsed() * 20));
      let progress = `Progress: [${bar}${' '.repeat(20 - bar.length)}]`;
      if (progressBar.element.textContent !== progress) progressBar.element.textContent = progress;
    },
    () => {},
    (game) => {
      activePort.open = true;
      progressBar.element.textContent = 'Progress: [##### COMPLETE #####]';
      Terminal.log(`${service} port ${port} opened`);
      target.addLog(
        game,
        'port',
        `${game.localhost}: Opened port ${port}`,
        true
      );
      
      setTimeout(() => game.processes.killProcess(pid), spindownDuration * 1000);
    }
  );
  
  pid = game.processes.addProcess(cmdName, runtimeTimer);
  runtimeTimer.start();
}

export default crackPort;
