// Generates the base empty element for a console output.
    // Type is going to be your output stream ('log', 'warn', or 'err')
class Entry {
  constructor (type) {
    this.element = document.createElement('div');
    this.element.className = 'terminal-entry ' + type;
  }
  
  // Fills the entry with content.
  populate (contents) {
    this.element.append(contents);
    return this; // For your chaining convenience.
  }
  
  // Pushes the filled element to the on-screen terminal.
  publish () {
    document.getElementById('terminal').insertBefore(
      this.element, document.getElementById('terminal-input-wrapper')
    );
  }
}

// Generates the base element specifically for logging commands.
class HistoryEntry extends Entry {
  constructor (prefix, command) {
    super('history');
    prefix.className += '.history-path ';
    this.element.append(prefix, command);
  }
}

// Generates individual pieces of the input prefix (user@host: /path/ $ )
  // Type is going to be a path class ('path-user-at-host', 'path-directory,' or
  // 'path-deco').
class InputPrefixComponent {
  constructor (type, contents) {
    this.element = document.createElement('span');
    this.element.className = 'path-component ' + type;
    this.element.innerText = contents;
  }
}

// Generates the input prefix (user@host: /path/ $ ) appropriate for the state.
class InputPrefix {
  constructor (game) {
    let username = game.activeMachine.activeUser.username;
      console.log(username);
    let hostname = game.activeMachine.hostname;
    
    let path = '';
    
    let workingDir = game.activeDirectory;
    while (workingDir !== null) {
      path = workingDir.filename + '/' + path;
      workingDir = workingDir.parent;
    }
    
    let elements = [
      new InputPrefixComponent(
        'path-user-at-host',
        ((username !== 'anonymous') ? username + '@' : '') + hostname
      ),
      
      new InputPrefixComponent('path-deco', ':'),
      
      new InputPrefixComponent('path-directory', path),
      
      new InputPrefixComponent(
        'path-deco',
        ((username === 'root') ? ' # ':' $ ')
      )
    ];
    
    this.element = document.createElement('div');
    this.element.className = 'path';
    
    for (let node of elements) this.element.append(node.element);
  }
}

// The object that'll actually receive any output and give it the appropriate
// class.
const Terminal = {
  log: message => {new Entry('log').populate(message).publish()},
  
  warn: message => {new Entry('warn').populate(message).publish()},
  
  error: message => {new Entry('err').populate(message).publish()},
  
  history: (prefix, command) => {new HistoryEntry(prefix, command).publish()}
};

const refreshInputPrefix = prefix => {
  try {
    document.getElementById('terminal-input-path')
      .getElementsByClassName('path')[0].replaceWith(prefix);
  } catch (typeError) { // If it hasn't been initialized yet
    document.getElementById('terminal-input-path').append(prefix);
  }
}

export default Terminal;
export {Terminal, InputPrefix, refreshInputPrefix};