import Internet from '../scripts/modules/network/internet.mjs';
import Machine from '../scripts/modules/network/device.mjs';
import * as FileSystem  from '../scripts/modules/os/filesystem.mjs';
import {User, ANONYMOUS} from '../scripts/modules/os/users.mjs';
import {SecurityInfo, PortMap} from '../scripts/modules/security/security.mjs';
import Commands from './commands.mjs';

const generateUserMap = userDict => {
  let out = new Map();
  for (let user of Object.keys(userDict)) out.set(user, new User(user, userDict[user]));
  return out;
}

// This helper creates a file permissions map that locks everything by default.
const rootOnlyPermissions = () => {
  let out = new Map();
  out.set(ANONYMOUS, new FileSystem.Permission(
    FileSystem.PermissionOption.DISALLOWED,
    FileSystem.PermissionOption.DISALLOWED,
    FileSystem.PermissionOption.DISALLOWED,
  ));
  return out;
}

const addTo = (machine, folderName, ...files) => {
  let dir = machine.root.children.get(folderName);
  for (let file of files) dir.addFile(file);
}

// This helper function will create a basic *NIX-like file tree.
const fileTreeSkeleton = () => {
  let defaultCommands = [ // Commands that should be in every machine's /bin.
    new FileSystem.Executable('cd', rootOnlyPermissions(), 'cd'),
    new FileSystem.Executable('clear', rootOnlyPermissions(), 'clear'),
    new FileSystem.Executable('echo', rootOnlyPermissions(), 'echo'),
    new FileSystem.Executable('help', rootOnlyPermissions(), 'help'),
    new FileSystem.Executable('ls', rootOnlyPermissions(), 'ls'),
    new FileSystem.Executable('mv', rootOnlyPermissions(), 'mv'),
  ];
  
  let defaultBoot = [ // Files that should be in every machine's /boot.
    new FileSystem.File('boot.ini', rootOnlyPermissions())
  ];
  
  let root = new FileSystem.Directory('', rootOnlyPermissions());
  
  root.addFile(new FileSystem.Directory('bin', rootOnlyPermissions()));
  for (let executable of defaultCommands) root.children.get('bin').addFile(executable);
  
  root.addFile(new FileSystem.Directory('boot', rootOnlyPermissions()));
  for (let file of defaultBoot) root.children.get('boot').addFile(file);
  
  root.addFile(new FileSystem.Directory('home', rootOnlyPermissions()));
  
  root.addFile(new FileSystem.Directory('var', rootOnlyPermissions()));
  root.children.get('var')
    .addFile(new FileSystem.Directory('log', rootOnlyPermissions()));
  return root;
}

// commands that should exist on every machine


const MachineSetup = game => {
  let internet = new Internet();

  let localhost = new Machine(
    'localhost',
    '127.0.0.1',
    fileTreeSkeleton(),
    generateUserMap({'root': ''}),
    new SecurityInfo(game, 10, new PortMap({ssh: 22, smtp: 25}), 3)
  );
  addTo(localhost, 'bin',
    new FileSystem.Executable('hardline', rootOnlyPermissions(), 'hardline')
  );
  internet.set(localhost);
  
  let testServer = new Machine(
    'testserver.net',
    '93.184.216.34',
    fileTreeSkeleton(),
    generateUserMap({'root': 'rosebud'}),
    new SecurityInfo(game, 60, new PortMap({ssh: 22}), 1)
  );
  addTo(testServer, 'home',
    new FileSystem.File('test.file', rootOnlyPermissions())
  );
  internet.set(testServer);
  
  return internet;
}

export default MachineSetup;
