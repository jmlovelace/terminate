import crackPort from '../security/portcracker.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    crackPort(
      game,
      args[0],
      'smtp',
      args[1],
      'relay',
      12,
      0.5
    );
  },
  
  help: filename =>
`${filename}: ${filename} <port>
  Forces a relay through an SMTP server listening on PORT, opening it.
  Requires a hardline connection to the target host.`
}