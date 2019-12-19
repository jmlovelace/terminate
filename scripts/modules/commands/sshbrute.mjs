import crackPort from '../security/portcracker.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    crackPort(
      game,
      args[0],
      'ssh',
      args[1],
      'brute force',
      8,
      0
    );
  },
  
  help: filename =>
`${filename}: ${filename} <port>
  Brute-force attacks an SSH server listening on PORT, opening it.
  Requires a hardline connection to the target host.`
}