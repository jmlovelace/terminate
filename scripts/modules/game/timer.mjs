class Timer {
  constructor(game, centiseconds, onStart, onUpdate, onEnd, onExpire) {
    this.game = game;
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
      () => {
        this.remaining--;
        this.onUpdate(this.game);
        if (this.remaining <= 0) {
          this.stop(this.game);
          this.onExpire(this.game);
        }
      },
      10
    );
  }
  
  pause () {
    clearInterval(this.countdown);
    this.countdown = null;
  }
  
  stop () {
    this.pause();
    this.remaining = 0;
    this.onEnd(this.game);
  }
}

export default Timer;
