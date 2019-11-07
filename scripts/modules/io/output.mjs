// Generates the base empty element for a console output.
    // Type is going to be your output stream ('log', 'warn', or 'err')
class Entry {
  constructor (type) {
    this.element = document.createElement(div);
    element.className = 'terminal-entry ' + type;
  }
  
  // Fills the entry with content.
  populate (contents) {
    this.element.innerHTML = contents;
    return this; // For your chaining convenience.
  }
  
  // Pushes the filled element to the on-screen terminal.
  publish () {
    document.getElementById('terminal')
      .insertBefore(this.element, 'terminal-input-wrapper');
  }
}



const Terminal = {
  log: message => {new Entry('log').populate(message).publish()}
  
  warn: message => {new Entry('warn').populate(message).publish()}
  
  error: message => {new Entry('err').populate(message).publish()}
};