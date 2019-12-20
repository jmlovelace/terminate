import Internet from '../scripts/modules/network/internet.mjs';
import Machine from '../scripts/modules/network/device.mjs';
import * as FileSystem  from '../scripts/modules/os/filesystem.mjs';
import {User, ANONYMOUS} from '../scripts/modules/os/users.mjs';
import {SecurityInfo, PortMap} from '../scripts/modules/security/security.mjs';
import Commands from './commands.mjs';
import crackingManual from './tutorialfiles.mjs';
import Terminal from '../scripts/modules/io/output.mjs';

// Don't do anything
const NO_ACTION = () => {};

// Generates a proper UserMap from a dictionary of username:password pairs
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

// Shortened executable constructor
const exe = cmdName => {
  return new FileSystem.Executable(cmdName, rootOnlyPermissions(), cmdName)
}

// Quick way to add a bunch of files to a particular directory
const addTo = (game, machine, folderName, ...files) => {
  let dir;
  try {
    dir = FileSystem.resolvePath(game, folderName, true, machine, machine.root);
  } catch (e) {
    console.error(`${machine.hostname}:${folderName} -- ${e}`);
  }
  files.forEach(file => dir.addFile(file));
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
  
  root.addFile(new FileSystem.Directory('etc', rootOnlyPermissions()));
  
  root.addFile(new FileSystem.Directory('home', rootOnlyPermissions()));
  root.children.get('home')
    .addFile(new FileSystem.Directory('mail', rootOnlyPermissions()));
  
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
    new SecurityInfo(
      game,
      10,
      new PortMap({ssh: 22, smtp: 25}),
      3,
      NO_ACTION,
      NO_ACTION
    )
  );
  addTo(game, localhost, '/bin', ...([
    'ftpbounce',
    'hardline',
    'nidhogg',
    'nmap',
    'smtprelay',
    'sshbrute',
  ].map(exe)));
  addTo(game, localhost, '/home',
    new FileSystem.Directory('downloads', rootOnlyPermissions()),
    new FileSystem.Directory('info', rootOnlyPermissions())
  );
  addTo(game, localhost, '/home/info',
    ...crackingManual
  );
  
  internet.set(localhost);
  
  let testServer = new Machine(
    'test.subvert.net',
    '93.184.216.34',
    fileTreeSkeleton(),
    generateUserMap({'root': 'rosebud'}),
    new SecurityInfo(
      game,
      120,
      new PortMap({
        ftp: 21,
        ssh: 22,
        smtp: 25,
        http: 80,
        ssl: 443,
        sql: 1433,
        torrent: 6881
      }),
      1,
      NO_ACTION,
      game => game.missions['Cracking Tutorial'].tryComplete(game)
    )
  );
  addTo(game, testServer, '/home',
    new FileSystem.File('test.file', rootOnlyPermissions())
  );
  internet.set(testServer);
  
  let databaseServer = new Machine(
    'r57.regional.polaris.nps',
    '108.86.163.188',
    fileTreeSkeleton(),
    generateUserMap({'root':'N0R7H-b0und'}),
    new SecurityInfo(
      game,
      120,
      new PortMap({
        ftp: 21,
        ssh: 22,
        smtp: 25,
        sql: 1433
      }),
      2,
      game => game.lose(),
      game => game.missions['Trial By Fire'].tryComplete(game)
    )
  );
  addTo(game, databaseServer, '/home',
    new FileSystem.TextFile('sql_claus.txt', rootOnlyPermissions(),
`He's making a list
He's checking it twice
SELECT * FROM children
WHERE behavior = "nice"
SQL Claus is coming to town

- DMS

We don't even have those things in the schema, Dave. - PTR`
    )
  );
  addTo(game, databaseServer, '/home/mail',
    new FileSystem.TextFile('re:secure_christmas.mail', rootOnlyPermissions(),
`From: mkt@pentest.tigerteam.com
Subject: Re: Secure Christmas

Wow, I can't believe you got that done so fast. I knew you guys were world-class
when it comes to toymaking, but I didn't know that goes for my cybersec toys,
too :)

In all seriousness, going from my hunch to a working proof of concept in less
than two weeks is a seriously commendable effort on your guys' part.`
    ),
    new FileSystem.TextFile('re:re:re:secure_christmas.mail', rootOnlyPermissions(),
`From: mkt@pentest.tigerteam.com
Subject: Re: Re: Re: Secure Christmas

Yes, yes, of course. We've all gotten the same lecture from our sysadmins. I'm
not so dumb that I'd keep a copy of this exploit on a public-facing machine.
For people who work for the big man up North, you'd think you'd learn to chill.`
    ),
    new FileSystem.TextFile('backup_key.mail', rootOnlyPermissions(),
`From: nick@heart.polaris.nps
Subject: Backup Key

As promised, here's the public key for read access to the central database. Also
as promised, it's set to rotate out within 72 hours. Take care, Prancer.`
    ),
    new FileSystem.TextFile('attention_important.mail', rootOnlyPermissions(),
`From: nooreply@e60.kcpfzdtyeaoya.com
Subject: Attention!!Important notice

==== [[ HELLO ]] ====
Third Reminder

We remind you the third time, you must answer! us to avoid recieve this message
several. Do you want unsusbcribe?

click here too usnubscribe
unsubsribe`
    )
  );
  addTo(game, databaseServer, '/etc',
    new FileSystem.Directory('sql_server', rootOnlyPermissions())
  );
  addTo(game, databaseServer, '/etc/sql_server',
    new FileSystem.Directory('data', rootOnlyPermissions()),
    new FileSystem.TextFile('common_queries.sql', rootOnlyPermissions(),
`'; DROP TABLE presents;--

Dave, I swear to Sleipnir, pull this crap again and we're throwing you into the
Erie in nothing but the stocking over your fireplace. You're lucky this is only
a mirror. I expect you to stay through the holidays if that's what it takes to
get these queries rewritten. - PTR`
    ),
    new FileSystem.TextFile('sql_server.conf', rootOnlyPermissions(),
`# this is read by the standalone daemon and embedded servers
[server]

# this is only for the sqlservd standalone daemon
[sqlservd]

#
# * Basic Settings
#
user            = sqlserv
port            = 1433
basedir         = /etc/sql_server
datadir         = /etc/sql_server/data
tmpdir          = /tmp
lc-messages-dir = /usr/share/sql_serv
skip-external-locking`
    ),
    new FileSystem.File('2371fd09b24.part', rootOnlyPermissions())
  );
  addTo(game, databaseServer, '/etc/sql_server/data',
    new FileSystem.File('chri_9850bfcc098a4ed6.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_b8ab5889db770666.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_c670c1f078ce3307.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_d237b7f921d2e32f.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_77c4174fcf016bce.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_0592461b782ed0cf.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_f9f17f8b16fcfb1f.mdf', rootOnlyPermissions()),
    new FileSystem.File('naug_2f87decd27af2f6f.mdf', rootOnlyPermissions()),
    new FileSystem.File('naug_2c066ac88d7b687e.mdf', rootOnlyPermissions()),
    new FileSystem.File('naug_319b9bed17b5ac86.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_41e40a250143f435.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_970704d58029b496.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_54c5fd28936d061d.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_64debaa1e08286c1.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_10f6babc71770c8d.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_110efadf19728f88.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_9ab8a0b292f5196a.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_ab08fd69acbed64f.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_82e8e51fc2a2fa44.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_a00a5209d4fdcbc7.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_43e2541ec407335c.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_c89b3a8fe33848a8.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_c7deadde0a71ba52.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_ff0fc562a2c2d0bb.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_70065f22768069a3.mdf', rootOnlyPermissions())
  );
  
  internet.set(databaseServer);
  
  let pentestServer = new Machine(
    'pentest.tigerteam.com',
    '145.83.254.37',
    fileTreeSkeleton(),
    generateUserMap({'root':'r@Wr_>:3'}),
    new SecurityInfo(
      game,
      120,
      new PortMap({
        ftp: 21,
        smtp: 25,
        sql: 1433
      }),
      2,
      game => game.lose(),
      NO_ACTION
    )
  );
  addTo(game, pentestServer, '/bin',
    exe('ftpbounce'),
    exe('hardline'),
    exe('sqlcorrupt')
  );
  addTo(game, pentestServer, '/home/mail',
    new FileSystem.TextFile('secure_christmas.mail', rootOnlyPermissions(),
`From: ptr@r57.regional.polaris.nps
Subject: Secure Christmas

Alrighty, Marvin, I've wrapped up development on that proof-of-concept. Attached
is a binary that can be pointed at a SQL Server port, at which point it'll pump
that thing so full of crazy unparseable memory that it'll have no choice but to
give way.

Merry Christmas.`
    ),
    new FileSystem.TextFile('re:re:secure_christmas.mail', rootOnlyPermissions(),
`From: mkt@pentest.tigerteam.com
Subject: Re: Re: Secure Christmas

Yeah, yeah, don't mention it -- I'll take anything to break up the monotony of
this little datacenter. I had more than enough time to put it together while
sitting on-site and just... waiting for something to go wrong.

Oh, and just making sure, you aren't storing that on an internet-connected
machine, are you? Ol' Kringle would have my hide if that thing got out into the
world at large while it's still a zero-day.`
    )
  );
  addTo(game, pentestServer, '/home',
    new FileSystem.TextFile('password.txt', rootOnlyPermissions(),
`<Cthon98> hey, if you type in your pw, it will show as stars
<Cthon98> ********* see!
<AzureDiamond> hunter2
<AzureDiamond> doesnt look like stars to me
<Cthon98> <AzureDiamond> *******
<Cthon98> thats what I see
<AzureDiamond> oh, really?
<Cthon98> Absolutely
<AzureDiamond> you can go hunter2 my hunter2-ing hunter2
<AzureDiamond> haha, does that look funny to you?
<Cthon98> lol, yes. See, when YOU type hunter2, it shows to us as *******
<AzureDiamond> thats neat, I didnt know IRC did that
<Cthon98> yep, no matter how many times you type hunter2, it will show to us as
          *******
<AzureDiamond> awesome!
<AzureDiamond> wait, how do you know my pw?
<Cthon98> er, I just copy pasted YOUR ******'s and it appears to YOU as hunter2
          cause its your pw
<AzureDiamond> oh, ok.`
    ),
    new FileSystem.TextFile('lost.txt', rootOnlyPermissions(),
`<erno> hm. I've lost a machine.. literally _lost_. it responds to ping, it
        works completely, I just can't figure out where in my apartment it is.`
    ),
    new FileSystem.TextFile('inversion.txt', rootOnlyPermissions(),
`<i8b4uUnderground> d-_-b
<BonyNoMore> how u make that inverted b?
<BonyNoMore> wait
<BonyNoMore> never mind`
    ),
    new FileSystem.TextFile('safety.txt', rootOnlyPermissions(),
`<xterm> The problem with America is stupidity. I'm not saying there should be a
         capital punishment for stupidity, but why don't we just take the safety
         labels off of everything and let the problem solve itself?`
    )
  );
  
  internet.set(pentestServer);
  
  let databaseHeart = new Machine(
    'heart.polaris.nps',
    '20.19.12.25',
    fileTreeSkeleton(),
    generateUserMap({'root':'7RU3-N0R7H'}),
    new SecurityInfo(
      game,
      90,
      new PortMap({
        ftp: 21,
        ssh: 22,
        smtp: 25,
        sql: 1433
      }),
      4,
      game => game.lose(),
      game => game.missions['Heart Attack'].tryComplete(game)
    )
  );
  
  addTo(game, databaseHeart, '/etc',
    new FileSystem.Directory('sql_server', rootOnlyPermissions())
  );
  addTo(game, databaseHeart, '/etc/sql_server',
    new FileSystem.Directory('data', rootOnlyPermissions()),
    new FileSystem.TextFile('common_queries.sql', rootOnlyPermissions(),
`'; DROP TABLE presents;--

Dave, I swear to Sleipnir, pull this crap again and we're throwing you into the
Erie in nothing but the stocking over your fireplace. You're lucky this is only
a mirror. I expect you to stay through the holidays if that's what it takes to
get these queries rewritten. - PTR`
    ),
    new FileSystem.TextFile('sql_server.conf', rootOnlyPermissions(),
`# this is read by the standalone daemon and embedded servers
[server]

# this is only for the sqlservd standalone daemon
[sqlservd]

#
# * Basic Settings
#
user            = sqlserv
port            = 1433
basedir         = /etc/sql_server
datadir         = /etc/sql_server/data
tmpdir          = /tmp
lc-messages-dir = /usr/share/sql_serv
skip-external-locking`
    ),
    new FileSystem.File('2371fd09b24.part', rootOnlyPermissions())
  );
  addTo(game, databaseHeart, '/etc/sql_server/data',
    new FileSystem.File('chri_9850bfcc098a4ed6.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_b8ab5889db770666.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_c670c1f078ce3307.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_d237b7f921d2e32f.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_77c4174fcf016bce.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_0592461b782ed0cf.mdf', rootOnlyPermissions()),
    new FileSystem.File('chri_f9f17f8b16fcfb1f.mdf', rootOnlyPermissions()),
    new FileSystem.File('naug_2f87decd27af2f6f.mdf', rootOnlyPermissions()),
    new FileSystem.File('naug_2c066ac88d7b687e.mdf', rootOnlyPermissions()),
    new FileSystem.File('naug_319b9bed17b5ac86.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_41e40a250143f435.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_970704d58029b496.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_54c5fd28936d061d.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_64debaa1e08286c1.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_10f6babc71770c8d.mdf', rootOnlyPermissions()),
    new FileSystem.File('pres_110efadf19728f88.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_9ab8a0b292f5196a.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_ab08fd69acbed64f.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_82e8e51fc2a2fa44.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_a00a5209d4fdcbc7.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_43e2541ec407335c.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_c89b3a8fe33848a8.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_c7deadde0a71ba52.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_ff0fc562a2c2d0bb.mdf', rootOnlyPermissions()),
    new FileSystem.File('addr_70065f22768069a3.mdf', rootOnlyPermissions())
  );
  
  internet.set(databaseHeart);
  
  return internet;
}

export default machineSetup;
