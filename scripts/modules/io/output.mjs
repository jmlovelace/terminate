function createEntry () {
  let out = document.createElement(div);
  out.className = 'terminal-entry';
  return out;
}

function insertEntry (entry) {
  document.getElementById('terminal')
    .insertBefore(entry, 'terminal-input-wrapper');
}

function populateEntry (...contents) {
  
}

const Terminal = {
  
};