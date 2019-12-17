import Terminal from '../io/output.mjs';
import {FileException, resolvePath} from '../os/filesystem.mjs';

let command;
export default command = {
  execute: async (game, args) => {
    let binContents = game.localhost.root.children.get('bin').children;
    
    if (!args[1] || args[1] === '') {
      let commandList = [];
      for (let child of binContents.keys()) {
        if (binContents.get(child).constructor.name === 'Executable') commandList.push(binContents.get(child).getHelp().split('\n')[0]);
      }
      Terminal.log(commandList.sort().join('\n'));
      return;
    }
    
    let command = binContents.get(args[1]);
    
    if (command && command.constructor.name === 'Executable') Terminal.log(command.getHelp());
    else Terminal.log(`${args[0]}: no help topics match '${args[1]}'.`);
  },
  
  help: filename =>
`${filename}: ${filename} [command]
  Lists commands available, or details on the usage of the COMMAND specified.`
}