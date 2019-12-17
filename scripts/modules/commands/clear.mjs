let command;

export default command = {
  execute: async (game, args) => {
    for (let entry of document.querySelectorAll('.terminal-entry')) {
      if (entry.id !== 'terminal-input-wrapper')entry.remove();
    }
  },
  
  help: filename => 
`${filename}: ${filename}
  Clears the terminal of entries.`
}