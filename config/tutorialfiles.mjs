import {TextFile, Permission, PermissionOption} from '../scripts/modules/os/filesystem.mjs';
import {ANONYMOUS} from '../scripts/modules/os/users.mjs';

const txt = (title, body) => new TextFile(
  `${title}.info`,
  new Map().set(
    ANONYMOUS,
    new Permission(
      PermissionOption.DISALLOWED,
      PermissionOption.DISALLOWED,
      PermissionOption.DISALLOWED
    )
  ),
  body
);

const crackingManual = [


txt('00_Overview',
`OVERVIEW
================================================================================
Cracking a machine is no easy feat -- it's complicated, rushed, dangerous, and
stressful. However, there's a simple process to it. Once you know the address of
your target (either a hostname like "example.com" or an IP like "192.168.97.23")
you can begin the process. You'll want to scan for vulnerabilities, establish a
hardline connection, open enough ports, acquire root, do your business, and then
cover your tracks and disconnect, all in just a couple of minutes.`
),

txt('01_Scanning',
`SCANNING A MACHINE
================================================================================
Before connecting, you'll want to scan your target so you have a good
understanding of what you'll need to eventually crack in. Use the "nmap" command
with the target's address to see what ports are listening, and how many need to
be opened. For example:

  $ nmap example.com

might return the following information:

  PORT      STATE     SERVICE
  21/tcp    closed    ftp
  22/tcp    closed    ssh
  25/tcp    open      smtp
  
  Open ports required to crack: 2

This tells us that there are 3 ports listening (ftp, ssh, and smtp), 2 need to
be open to break into this machine, and 1 (smtp port 25) already is.`
),

txt('02_Hardline',
`HARDLINE CONNECTIONS
================================================================================
Once you know you're ready to attack a machine, you'll need to establish a
hardline connection to it. Doing so is simple enough, just use the "hardline"
command with the address of your target, like so:

  $ hardline example.com

Be ready -- most machines consider a hardline connection to be incredibly
suspicious, and will trigger an active trace as soon as you connect. What that
means is explained more thoroughly later, but basically, if you're still
connected when that timer hits zero, you're in trouble.

Once you're done with a target, just run "hardline -d" to disconnect. Make sure
you do this before time runs out, or you're toast!`
),

txt('03_Opening_Ports',
`OPENING PORTS
================================================================================
The tool you use to break into a system requires a few open ports to work its
magic -- that's what port crackers are for. You'll need to know what service is
listening on a port, what port number it's listening on, and the right port
cracker for the service. You already have a couple -- the service name's in the
command. For example, to open port 22 with ssh listening on it, you'd just type:

  $ sshbrute 22

while you're hardlined into a system. It's similar for all the cracks. Once you
launch a cracker, it'll take a bit to do its job, and while you can have
multiple running at once, they'll all run slower as a result. Budget your time
effectively -- forcing ports leaves suspicious logs behind, and they'll all
reset to closed again once you disconnect from hardline anyhow.`
),

txt('04_Acquiring_Root',
`ACQUIRING ROOT
================================================================================
Once you have all the ports you need open on the system you're hardlined into,
you're ready to acquire root privileges -- get admin access to the system you're
on. Normally, this is the hardest part, but we've got a handy tool to do it.

After you've opened enough ports while you're still hardlined, just run the
command "nidhogg", and you'll get root access after a few seconds. You're still
on borrowed time, but now you're able to do whatever you need with what little
you've got left -- just make sure you leave enough time to cover your tracks.`
),

txt('05_Getting_Away_With_It',
`TRACES
================================================================================
Most machines consider a hardline connection to be suspicious, so as soon as you
hardline into one, it'll likely start attempting to trace you. There are two
kinds of trace -- active and passive.

An active trace tries to follow an open connection back to its source. If you're
caught by one, you're toast. Fortunately, you can see an estimate of how long
until it finishes in the upper right corner of your screen during a hardline, so
you know how long you've got left.

A passive trace is the investigation done after you disconnect -- usually by
skimming server logs, in /var/log, for connection info. Remove them with "rm" to
cover your trail before you disconnect.

Essentially, just remember to delete logs and don't let the timer run out.`
)


];

export default crackingManual;
