// We'll use a generator to cycle through tracks and autoshuffle once they all play.
function* context (tracks) {
  while (true) {
    // Shuffle block
    // let last = tracks[tracks.length - 1];
    // Fisher-Yates shuffle
    for (let i = tracks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      
      let tmp = tracks[i];
      tracks[i] = tracks[j];
      tracks[j] = tmp;
    }
    
    for (let trackNum = 0; trackNum < tracks.length; trackNum++) {
      yield tracks[trackNum];
    }
  }
}

class TrackList {
  constructor () {
    // Config
    //   Directories are relative to index.html!
    const trackDir = './media/music/';
    const ambientDir = 'ambient/';
    const hardlineDir = 'hardline/';
    const trackExt = 'mp3'; // try and keep this consistent
    
    //   Track titles (no path or file extension)
    const ambientTracks = [
      'ambient0',
      'ambient1',
      'ambientN'
    ];
    
    const hardlineTracks = [
      'hardline0',
      'hardline1',
      'hardlineN'
    ];
    
    this.ambient = context(ambientTracks.map(
      track => new Audio(`${trackDir}${ambientDir}${track}.${trackExt}`)
    ));
    this.hardline = context(hardlineTracks.map(
      track => new Audio(`${trackDir}${hardlineDir}${track}.${trackExt}`)
    ));
    
    this.nowPlaying = new Audio(); // just a placeholder to avoid initial NPEs
    this.hasPlaying = false;
  }
  
  play (context) {
    this.nowPlaying.pause();
    this.hasPlaying = false;
    this.nowPlaying.currentTime = 0;
    this.nowPlaying = this[context].next().value;
    this.nowPlaying.play()
    this.hasPlaying = true;
    this.nowPlaying.onended = () => this.play(context);
    console.log(`Now Playing: ${this.nowPlaying.src.split('.')[0].split('/').pop()}`);
  }
}

let backgroundMusic = new TrackList();

export default backgroundMusic;
