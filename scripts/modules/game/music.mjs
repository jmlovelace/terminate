class TrackList {
  constructor() {
    this.all = new Map();
    this.ambient = new Map();
    this.hardline = new Map();
  }
  
  addTrack(name, path, context) {
    let track = new Audio(path);
    this.all.add(name, track);
    this[context].add(name, track);
  }
}

class GameAudio {
  constructor(tracklist) {
    this.tracks = tracklist;
    this.nowPlaying = null;
  }
  
  play(name) {
    this.nowPlaying = this.all.get(name);
  }
  
  playRandom(context) {
    let trackIterator = this[context].keys();
    let tracklist = [];
    
    // Iterators aren't indexed, so fetching a random element from one is hard.
    // Here, we essentially convert it into an array.
    for (let trackname of trackIterator) {
      tracklist.push(trackname);
    }
    
    // The index of tracklist here is randomly selected among all valid values.
    // In other words, any value between 0 and (tracklist.length - 1).
    play(tracklist[Math.floor(Math.random() * tracklist.length)]);
  }
}