import Internet from '../scripts/modules/network/internet.mjs';
import Machine from '../scripts/modules/network/device.mjs';
import * as FileSystem  from '../scripts/modules/os/filesystem.mjs';
import {User, ANONYMOUS} from '../scripts/modules/os/users.mjs';
import {SecurityInfo, PortMap} from '../scripts/modules/security/security.mjs';
import Commands from './commands.mjs';

const generateUserMap = userDict => {
  let out = new Map();
  for (let user of Object.keys(userDict)) out.set(user, new User(user, userDict[user]));
  out.set('anonymous', ANONYMOUS);
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

const exe = cmdName => {
  return new FileSystem.Executable(cmdName, rootOnlyPermissions(), cmdName)
}


const addTo = (machine, folderName, ...files) => {
  files.forEach(file => machine.root.children.get(folderName).addFile(file));
}

// This helper function will create a basic *NIX-like file tree.
const fileTreeSkeleton = () => {
  let defaultCommands = [ // Commands that should be in every machine's /bin.
    'cat',
    'cd',
    'clear',
    'echo',
    'help',
    'ls',
    'mv',
    'rm',
    'scp'
  ].map(exe);
  
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


const machineSetup = game => {
  let internet = new Internet();

  let localhost = new Machine(
    'localhost',
    '127.0.0.1',
    fileTreeSkeleton(),
    generateUserMap({'root': ''}),
    new SecurityInfo(game, 10, new PortMap({ssh: 22, smtp: 25}), 3, ()=>{})
  );
  addTo(localhost, 'bin', ...([
    'brutessh',
    'hardline',
    'nidhogg',
    'nmap'
  ].map(exe)));
  addTo(localhost, 'home',
    new FileSystem.Directory('downloads', rootOnlyPermissions())
  );
  internet.set(localhost);
  
  let testServer = new Machine(
    'testserver.net',
    '93.184.216.34',
    fileTreeSkeleton(),
    generateUserMap({'root': 'rosebud'}),
    new SecurityInfo(game, 120, new PortMap({ssh: 22}), 1, game=>game.lose())
  );
  addTo(testServer, 'home',
    new FileSystem.File('test.file', rootOnlyPermissions())
  );
  internet.set(testServer);
  
  return internet;
}

export default machineSetup;
