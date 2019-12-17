import Terminal from '../io/output.mjs';

let command;
// This command, ls, prints the contents of the current working directory.
export default command = {
  execute: async (game, args) => {
    let showAll = (args[1] === '-a' || args[1] === '-all');
    
    for (let filename of game.activeDirectory.children.keys()) {
      // hides files starting with . unless -a is set
      if (!showAll && filename[0] === '.') continue;
      
      let outputName = filename;
      let outputStyle = undefined;
      
      // Here we labelled the switch, to make it clear which block is being broken
      decorators: switch (game.activeDirectory.children.get(filename).constructor.name) { // decorate based on file type
        case ('Directory'):
          outputName += '/';
          outputStyle = {'color': 'var(--accent-secondary)', 'font-weight': 'bold'};
          break decorators;
        case ('Executable'):
          outputStyle = {'color': 'var(--accent-primary)'}
          break decorators;
      }
      
      Terminal.log(outputName, outputStyle);
    }
  },
  
  help: filename =>
`${filename}: ${filename} [-a|--all]
  Lists files in the current directory.
  
  -a: Lists hidden files.`
}