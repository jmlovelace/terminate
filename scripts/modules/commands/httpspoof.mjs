import crackPort from '../security/portcracker.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    crackPort(
      game,
      args[0],
      'http',
      args[1],
      'impersonation',
      14,
      1
    );
  },
  
  help: filename =>
`${filename}: ${filename} <port>
  Spoofs privileged IPs through an HTTP server listening on PORT, opening it.
  Requires a hardline connection to the target host.`
}