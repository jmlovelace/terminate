class Timer {
  constructor(game, centiseconds, onStart, onUpdate, onEnd, onExpire) {
    this.game = game;
    this.totalDuration = centiseconds;
    this.remaining = centiseconds; // (int) time left in hundredths of a second
    
    // Functions:
    //   onStart: whenever start() is called
    //   onUpdate: every 10ms interval while the timer is running
    //   onEnd: whenever stop() is called and/or the time runs out
    //   onExpire: when the time runs out naturally
    this.onStart = (onStart) ? onStart : ()=>{};
    this.onUpdate = (onUpdate) ? onUpdate : ()=>{};
    this.onEnd = (onEnd) ? onEnd : ()=>{};
    this.onExpire = (onExpire) ? onExpire : ()=>{};
    
    this.countdown = null;
  }
  
  start () {
    this.onStart(this.game);
    this.countdown = setInterval(
      async () => { // Marking this as async means it doesn't delay the timer.
        this.remaining--;
        this.onUpdate(this.game);
        if (this.remaining <= 0) {
          this.onExpire(this.game);
          this.stop();
        }
      },
      10
    );
  }
  
  pause () {
    // If you're asking "what the LISP?", just know that "this" is a bad keyword
    clearInterval((()=>this.countdown)());
    this.countdown = null;
  }
  
  stop () {
    this.pause();
    this.remaining = 0;
    this.onEnd(this.game);
  }
  
  getElapsed () {
    return (this.totalDuration - this.remaining) / this.totalDuration;
  }
}

export default Timer;
