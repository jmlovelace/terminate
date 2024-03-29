HTML
========
**`./index.html`** is the main page to be served, naturally. It should remain
fairly spartan when not being used for testing, as it should ideally be
populated by the JavaScript. (Note: this is one of the only times where saying
that sentence with a straight face is okay.)

Aside from that, there shouldn't be any standalone HTML files.



CSS
========
**`style/style.css`** handles most of the layout styling of the page.

**`style/themes/`** contains a number of "theme" files, which control colors and
some typographic styling. They can be loaded in for use by **style/style.css**.



JavaScript
========
**`scripts/script.js`** is the main entry point.

**`scripts/modules/`** contains the majority of the actual logic, divided into
different game aspects. Each file is an ES6 module with the file extension
`**.mjs**`.

**`config/`** also contains some configuration files for you to use. Set these
yourself to best fit your hosting environment.


**`scripts/modules/commands/`**
--------
This folder's modules each represent the logic for a single \*nix-like "program"
(e.g. `ls`) that can be invoked by **`scripts/io/input.mjs`**. Each one should
contain the following:
```js
let command;

export default command = {
  execute: async (game, args) => {}, // actual command logic
  
  help: filename =>
`${filename}: ${filename} ` // single template literal to be returned
}
```
`execute` contains an async function that takes the `Game` object and an `args`
String[] from **`modules/io/input.mjs`**. `args[0]` will always be the command's
name as it was called from the terminal.

`help` contains a simple arrow function that returns the String to be printed by
the `help` command. It itself accepts a string that evaluates to the command's
filename.


**`scripts/modules/game/`**
--------
This folder's modules handle the current state of the player and the game, as
well as helper logic. **`async.mjs`** handles timers, **`music.mjs`** handles
the background music, and **`game.mjs`** holds the game's state.


**`scripts/modules/io/`**
--------
This folder's modules all handle taking and parsing input from the console, as
well as output to it. **`input.mjs`** covers your standard input stream, as well
as parsing arguments, and **`output.mjs`** covers the standard output, warning,
and error streams.


**`scripts/modules/network/`**
--------
This folder's modules handle the in-game network, as well as all the machines
on it. **`device.mjs`** represents an individual machine, representing its
network identifiers, links to other devices, and OS & security details (held in
**`scripts/modules/os/`** and **`scripts/modules/security/`**, respectively).
**`internet.mjs`** holds a map of all the game's machines.


**`scripts/modules/os/`**
--------
This folder's modules handle components of each individual machine's game state.
**`filesystem.mjs`** represents each individual machine's filesystem, as well as
the files and such themselves, including those on the player's home machine.
**`users.mjs`** handles user profiles for each machine, including a default
profile representing a user not currently logged in (`ANONYMOUS`).


**`config/`**
--------
This folder's modules handle the configuration of the game.

Comments in each will walk you through how to set them up.

**`commands.mjs`** is where the modules in the **`scripts/modules/commands/`**
directory are loaded; this shouldn't need end-user modification unless you start
adding your own.

**`tracks.mjs`** is where the music in the **`media/music/`** directory is
loaded; it's not an essential file to set up, and will not come preconfigured
(as the game does not come with music by default).


Media
========
Include **`media/music/`** in your local copy to hold the background music to
the game. Inside it should be two directories, **`media/music/ambient`** and
**`media/music/hardline`**, for the standard gameplay and "hacking mode" tracks,
respectively.
