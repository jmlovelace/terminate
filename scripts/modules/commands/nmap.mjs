import Terminal from '../io/output.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    let target = (args[1]) ? game.internet.get(args[1]) : game.activeMachine;
    if (!target) target = game.internet.get(game.internet.resolve(args[1]));
    if (!target) {
      Terminal.error(`${args[0]}: Could not establish connection to ${args[1]}`);
      return;
    }
    
    // If you're asking yourself "What the hell IS this?", good. That's natural.
    Terminal.log(
`${args[0]} scan report for ${target.hostname} (${target.ip})
Not shown: ${Math.floor(Math.random() * 200) + 800} filtered ports
PORT      STATE     SERVICE
${target.securityInfo.ports.getPorts().reduce((acc, port) =>
  acc += `${port.number}/tcp${' '.repeat(5 - Math.floor(Math.log10(port.number)))}${port.open ? 'open  ' : 'closed'}    ${port.service}
`, '')}
Open ports required to crack: ${target.securityInfo.portsNeeded}`
    );
  },
  
  help: filename =>
`${filename}: ${filename} [hostname|ip]
  Shows port details for the specified host, or the current machine if the host
  is left unspecified.`
}