import Timer from '../game/timer.mjs';

const activateHardline = game => {
  
};

const deactivateHardline = game => {
  
};

class HardlineInfo {
  constructor (game, secondsDuration) {
    this.timer = new Timer(
      game,
      secondsDuration * 100,
      activateHardline,
      game => game.overlay.innerText = this.timer.remaining / 100,
      deactivateHardline,
      game => game.lose()
    );
  }
  
  
}