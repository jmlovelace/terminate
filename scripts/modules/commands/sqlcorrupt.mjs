import crackPort from '../security/portcracker.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    crackPort(
      game,
      args[0],
      'sql',
      args[1],
      'corruption',
      12.2,
      0
    );
  },
  
  help: filename =>
`${filename}: ${filename} <port>
  Injects corrupted memory into a SQL server listening on PORT, opening it.
  Requires a hardline connection to the target host.`
}