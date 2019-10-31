HTML
========
**`./index.html`** is the main page to be served, naturally. It should remain
fairly spartan when not being used for testing, as it should ideally be
populated by the JavaScript.

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


**`scripts/modules/commands/`**
--------
This folder's modules each represent the logic for a single \*nix-like "program"
(e.g. `ls`) that can be invoked by **`scripts/io/input.mjs`**. Each one should
contain a single async function with the following signature:
```js
export async function command(player, args) {}
```
where `player` is a `Player` object from **`scripts/player/player.mjs`**, and
**`args`** is an `Arguments` object from **`scripts/io/input.mjs`**. Its return
value should be a `Promise`.


**`scripts/modules/game/`**
--------
This folder's modules handle the current state of the player and the game.


**`scripts/modules/io/`**
--------
This folder's modules all handle taking and parsing input from the console, as
well as output to it. **`input.mjs`** will cover your standard input stream, as 
well as parsing `Arguments`, and **`output.mjs`** will cover the standard
output, warning, and error streams.


**`scripts/modules/network/`**
--------
This folder's modules handle the in-game network, as well as all the machines
on it. **`device.mjs`** represents an individual machine, representing its
network identifiers, links to other devices, and OS & security details (held in
**`scripts/modules/os/`** and **`scripts/modules/security/`**, respectively).


**`scripts/modules/os/`**
--------
This folder's modules handle components of each individual machine's game state.
**`filesystem.mjs`** represents each individual machine's filesystem, as well as
the files and such themselves, including those on the player's home machine.
**`users.mjs`** handles user profiles for each machine, including a default
profile representing a user not currently logged in (`ANONYMOUS`).



Media
========
Include **`media/music/`** in your local copy to hold the background music to
the game. Inside it should be two directories, **`media/music/ambient`** and
**`media/music/hardline`**, for the standard gameplay and "hacking mode" tracks,
respectively.