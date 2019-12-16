import commands from '../../../config/commands.mjs';

// Defines RWX permission values
const PermissionOption = Object.freeze({
  INHERIT: -1,    // use permission value of parent
  DISALLOWED: 0,  // do not allow access to this function
  ALLOWED: 1      // allow access to this function
});

// Holds RWX permission values -- takes three PermissionOption constants
class Permission {
  constructor(r,w,x) {
    this.read = r;
    this.write = w;
    this.execute = x;
  }
}

// Specifies a filesystem object, aka a File. Anything directly exposed to the
// filesystem will be an instance of this object.
// Permissions should be a Map of User:Permission pairs. Anonymous and User
// should be valid keys, and Root shouldn't be.
class File {
  constructor(filename, permissions) {
    this.parent = null;
    this.filename = filename; // last slash-delimited token
    this.permissions = permissions;
  }
}

// Specifies a directory, which holds other files.
class Directory extends File {
  constructor(filename, permissions) {
    super(filename, permissions);
    this.children = new Map();
    
    // Add relative filepath pointers
    this.children.set('.', this);
    this.children.set('..', this.parent);
  }
  
  // Marks an existing file as a child of this directory.
  addFile(file) {
    file.parent = this;
    if (file.constructor.name === 'Directory') file.children.set('..', file.parent);
    return this.children.set(file.filename, file);
  }
  
  // Unmarks the file as a child.
  removeFile(file) {
    return this.children.delete(file.filename);
  }
}

// Specifies an executable file, which can be invoked to execute a function.
// The function itself is stored as the program property.
class Executable extends File {
  constructor(filename, permissions, program) {
    super(filename, permissions);
    
    this.program = commands.get(program); // one of the functions in commands/
  }
  
  // Executes the command held by this file.
  run(game, argumentString) {
    return this.program.execute(game, argumentString);
  }
}

// Specifies a text file, which contains text that can be viewed and changed.
class TextFile extends File {
  constructor(filename, permissions, text) {
    super(filename, permissions);
    this.text = text;
  }
}

const FileException = Object.freeze({
  NotExists: 'FileException.NotExists: Attempted to access a non-existent file',
  NotDirectory: 'FileException.NotDirectory: Attempted to get children of a non-directory',
  NotExecutable: 'FileException.NotExecutable: Attempted to execute a non-executable file',
  NotPermitted: 'FileException.NotPermitted: User has insufficient permissions for file action'
});

// Resolves file paths into the File object located there.
const resolvePath = (game, path, forceDirectory = false) => {
  let workingDirectory;
  let directories = path.trim();
  
  if (directories === '') return null;
  
  directories = directories.split('/');
  
  // forces final file to resolve its self-pointer, which'll throw if said file
  // isn't a directory. don't try this at home, kids.
  if (forceDirectory) directories.push('.');
  if (directories[0] === '') {
    workingDirectory = game.activeMachine.root;
    directories.shift(); // remove the pointer to root
  } else {
    workingDirectory = game.activeDirectory;
  }

  for (let directory of directories) {
    if (directory === '') continue; // skip blank tokens (String.split() may give these)
    
    if (workingDirectory.constructor.name !== 'Directory') {
      throw FileException.NotDirectory;
    }
    
    workingDirectory = workingDirectory.children.get(directory);
    
    if (workingDirectory === undefined) {
      throw FileException.NotExists;
    }
  }
  
  return workingDirectory;
}

export {
  FileException,
  PermissionOption,
  Permission,
  File,
  Directory,
  Executable,
  TextFile,
  resolvePath
};
