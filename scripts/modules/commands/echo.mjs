import Terminal from '../io/output.mjs';

// This command, echo, simply prints its arguments to the terminal.
// Primarily useful for testing purposes.
export default async function command(game, args) {
  args.shift(); // don't print this command's name every time it's called!
  Terminal.log(args.join(' '));
}
