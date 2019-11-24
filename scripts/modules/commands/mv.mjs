import Terminal from '../io/output.mjs';
import {FileException, resolvePath} from '../os/filesystem.mjs';

// This command, mv, moves a file in one path to a different path.
export default async function command(game, args) {
  let source;
  let dest;
  let destName;
  
  try {
    source = resolvePath(game, args[1]);
  } catch (e) {
    switch (e) {
      case (FileException.NotExists):
      case (FileException.NotDirectory):
        Terminal.log(`${args[0]}: cannot stat '${args[1]}': No such file or directory`);
        break;
      default: // uh oh, this shouldn't happen, throw it up the chain
        throw e;
    }
  }
  
  try {
    dest = args[2].split('/');
    destName = dest.pop();
    dest = resolvePath(game, dest.join('/'));
    if (dest.children.get(destName) && dest.children.get(destName).constructor.name === 'Directory') {
      dest = dest.children.get(destName);
      destName = source.filename;
    }
  } catch (e) {
    switch (e) {
      case (FileException.NotExists):
      case (FileException.NotDirectory):
        Terminal.log(`${args[0]}: cannot move '${args[1]}' to '${args[2]}': No such file or directory`);
      default: // uh oh, this shouldn't happen, throw it up the chain
        throw e;
    }
  }
  
  console.log(source);
  console.log(dest);
  
  source.parent.removeFile(source)
  source.filename = destName;
  dest.addFile(source);
}
