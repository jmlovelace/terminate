import Terminal from '../io/output.mjs';

export default command {
  execute: async (game, args) => {
    let target = game.internet.get(args[1]);
    if (!target) target = game.internet.get(game.internet.resolve(args[1]));
    
    if (!target) {
      Terminal.log(`${args[0]}: Could not establish connection to '${args[1]}'`);
      return;
    }
    
    target.securityInfo.timer.start();
  },
  
  help: filename =>
`${filename}: ${filename} <[hostname|ip]|[--disconnect|-d]>
  Establishes a direct hardline connection to a given host, or closes the active
`;
}
