import Terminal from '../io/output.mjs';

// This command, cd, changes the current working directory.
export default async function command(game, args) {
  let workingDirectory;
  let directories = args[1].trim();
  
  directories = directories.split('/');
  
  if (directories[0] === '') {
    workingDirectory = game.activeMachine.root;
    directories.shift(); // remove the pointer to root
  } else {
    workingDirectory = game.activeDirectory;
  }
  
  for (let directory of directories) {
    if (directory === '') continue; // skip blank tokens (String.split() may give these)
    
    workingDirectory = workingDirectory.children.get(directory);
    if (workingDirectory === undefined) {
      Terminal.log('cd: ' + args[1] + ': No such file or directory');
      return;
    }
    if (workingDirectory.constructor.name !== 'Directory') {
      Terminal.log('cd: ' + args[1] + ': Not a directory');
      return;
    }
  }
  
  // This point should only be reached if each step was a valid directory
  game.activeDirectory = workingDirectory;
}
