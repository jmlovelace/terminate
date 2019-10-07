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
    this.nowPlaying = this[context].
  }
}