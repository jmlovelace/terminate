import crackPort from '../security/portcracker.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    crackPort(
      game,
      args[0],
      'ftp',
      args[1],
      'bounce',
      7,
      0.5
    );
  },
  
  help: filename =>
`${filename}: ${filename} <port>
  Executes a bounce against an FTP server listening on PORT, opening it.
  Requires a hardline connection to the target host.`
}