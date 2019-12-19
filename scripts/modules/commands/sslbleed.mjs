import crackPort from '../security/portcracker.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    crackPort(
      game,
      args[0],
      'ssl',
      args[1],
      'bleed',
      12,
      3
    );
  },
  
  help: filename =>
`${filename}: ${filename} <port>
  Harvests data from the memory of an SSL server listening on PORT, opening it.
  Requires a hardline connection to the target host.`
}