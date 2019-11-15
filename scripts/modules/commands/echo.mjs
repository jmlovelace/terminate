export async function command(game, args) {
  args.shift(); // don't print this command's name every time it's called!
  Terminal.log(args.join(' '));
}