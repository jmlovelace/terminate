import crackPort from '../security/portcracker.mjs';

let command;

export default command = {
  execute: async (game, args) => {
    crackPort(
      game,
      args[0],
      'torrent',
      args[1],
      'poison',
      4.8,
      16.5
    );
  },
  
  help: filename =>
`${filename}: ${filename} <port>
  Routes poisoned packets to a BitTorrent client listening on PORT, opening it.
  Requires a hardline connection to the target host.`
}