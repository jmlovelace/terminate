import {resolvePath, FileException} from '../scripts/modules/os/filesystem.mjs';
import Terminal from '../scripts/modules/io/output.mjs';

const wait = async ms => await new Promise(resolve => setTimeout(resolve, ms));
  
class Mission {
  constructor (onStart, onComplete, completionConditions) {
    this.onStart = onStart;
    this.onComplete = onComplete;
    this.checkIfComplete = completionConditions;
    
    this.started = false;
    this.completed = false;
  }
  
  start (game) {
    if (!(this.started)) {
      this.started = true;
      this.onStart(game);
      console.log('starting new mission');
    }
  }
  
  tryComplete (game) {
    if (!(this.completed)) {
      console.log('checking for mission completion');
      this.completed = this.checkIfComplete(game);
      if (this.completed) {
        console.log('completed');
        this.onComplete(game);
      }
    }
  }
}

let missions = {
  'Terminal Tutorial': new Mission(
    /*onStart*/ async game => {
      Terminal.log('Logging in...');
      await wait(2000);
      Terminal.log('Done.');
      await wait(2000);
      game.sendMail('deleteme',
`From: mentor@subvert.net
Subject: deleteme

delete this email. use "rm"`
      );
      await wait(2000);
      Terminal.log('Saved mail at /home/mail/deleteme.mail');
      await wait(2000);
      Terminal.log('View contents of current directory by typing "ls"');
      await wait(2000);
      Terminal.log('Change to a different directory with "cd"');
      await wait(2000);
      Terminal.log('Read file contents with "cat"');
      await wait(2000);
      Terminal.log('Type "help" [command] for more info');
    },
    
    /*onComplete*/ async game => {
      await wait(2000);
      game.missions['Cracking Tutorial'].start(game);
    },
    
    /*completionConditions*/ game => {
      try {
        resolvePath(game, '/home/mail/deleteme.mail', false, this.localhost, this.localhost.root);
      } catch (e) {
        return true;
      }
    }
  ),
  
  'Cracking Tutorial': new Mission(
    /*onStart*/ game => {
      game.sendMail('welcome',
`From: mentor@subvert.net
Subject: Welcome

Alright, glad to see you've got the hang of how to use your computer. Or, well,
enough to be taught further, at least. Now, we have some work for you, but first
we need to make sure you've got what it takes to break into a secure system. In
our circles, we call it "cracking", though you're probably more familiar with
the term hacking. There's a lot of reasons we don't call it that, but that's a
story for another time.

So, today, you're going to be trying to break into our test server. It's a handy
little machine we've got, and there's no risk of getting in trouble if you mess
up, so definitely use it to try out new things whenever you'd like. You should
already have the tools you need, and there's some advice from yours truly in
the /home/info directory on your machine on how to use 'em. Once you're ready,
crack test.subvert.net, and read the test file with the "cat" command to prove
you did it. Oh, and don't get caught.

Happy hacking :)`
      );
    },
    /*onComplete*/ game => {
      game.missions['Trial By Fire'].start(game);
    },
    /*completionConditions*/ game => {
      let complete = false;
      
      let machine, file;
      
      machine = game.internet.get(game.internet.resolve('test.subvert.net'));
      
      try {
        file = resolvePath(
          game,
          '/home/test.file',
          false,
          machine,
          machine.root
        );
      } catch (e) {
        console.warn(e);
        game.sendMail('seriously',
`From: admin@subvert.net
Subject: seriously?

dude, why did you delete the test file? we had logging in place to track when
it's accessed so we can verify how a test-taker did. now i gotta set that back
up.

thanks.`
        );
        return true;
      }
      
      return file.touchedBy('cat');
    }
  ),
  
  'Trial By Fire': new Mission(
    /*onStart*/ game => {
      game.sendMail('firewalk',
`From: mentor@subvert.net
Subject: Fire Walk

Great job! Were it not for a custom logging system build specifically for that
file, we never would've been able to tell it was you. Now that you've proven
yourself, let's talk business.

Christmas is near, and it'd appear that we're all on the naughty list -- you
included. Who knew the man in red had a thing against unauthorized systems
access? No matter, fixing the issue should be a cinch. Y'see, in this day and
age, even Santa has to modernize, and we just found his database server. He only
tracks the naughty list, oddly, so all you need to do is remove those records --
probably in /etc/sql_server/data or whereabouts. Nuke the whole thing, even. I
don't see any problem with just going "rm *".

The database server is at r57.regional.polaris.nps, good luck.`
      );
    },
    /*onComplete*/ game => game.missions['Heart Attack'].start(game),
    /*completionConditions*/ game => {
      let target = game.internet.get(game.internet.resolve('r57.regional.polaris.nps'));
      let file;
      try {
        file = resolvePath(game, '/etc/sql_server/data/naug_2f87decd27af2f6f.mdf', false, target, target.root);
      } catch (e) {
        return true;
      }
    }
  ),
  
  'Heart Attack': new Mission(
    /*onStart*/ game => {
      game.sendMail('database',
`From: mentor@subvert.net
Subject: Database

Well, crap. Turns out, that server was only a mirror for the actual database. I
should've known -- the IP is out of Toledo. That said, it's gotta have something
or another connecting it back to the main server. Try snooping around the files
some and see what you can find. The real deal is probably a lot more tightly
locked down, too -- see if you can find any more tools before you hit it. Files
can be downloaded with "scp", and since you can run any executable in your /bin
as a command, it's as simple as using "mv" to move it there from /home/downloads
and getting on your merry way.

Good luck with this one. If you find anything good, go for it.`
      );
    },
    /*onComplete*/ game => game.win(),
    /*completionConditions*/ game => {
      let target = game.internet.get(game.internet.resolve('heart.polaris.nps'));
      try {
        resolvePath(game, '/etc/sql_server/data/naug_2f87decd27af2f6f.mdf', false, target, target.root);
      } catch (e) {
        return true;
      }
    }
  )
};

export default missions;
