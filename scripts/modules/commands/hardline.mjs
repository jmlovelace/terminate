import Terminal from '../io/output.mjs';

export default async function command(game, args) {
  let target = game.internet.get(args[1]);
  if (!target) target = game.internet.get(game.internet.resolve(args[1]));
  
  if (!target) {
    Terminal.log(`${args[0]}: Could not establish connection to '${args[1]}'`);
    return;
  }
  
  target.securityInfo.timer.start();
}
