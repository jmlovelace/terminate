import Timer from '../game/timer.mjs';

const activateHardline = game => {
  game.theme = game.themes.hardline;
};

const deactivateHardline = game => {
  game.overlay.innerText = '';
  game.theme = game.themes.ambient;
};

class HardlineInfo {
  constructor (game, seconds) {
    this.timer = new Timer(
      game,
      seconds * 100,
      activateHardline,
      game => game.overlay.innerText = (this.timer.remaining / 100).toFixed(2),
      deactivateHardline,
      game => game.lose()
    );
    
    this.seconds = seconds;
  }
  
  refreshTimer () {
    this.timer.remaining = this.seconds * 100;
  }
}

export default HardlineInfo;
