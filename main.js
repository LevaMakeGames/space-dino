import HomeScene from './scenes/HomeScene.js';
import ShopScene from './scenes/ShopScene.js';
import CardsScene from './scenes/CardsScene.js';
import BattleScene from './scenes/BattleScene.js';
import HelpScene from './scenes/HelpScene.js';
import BattlePhaseScene from './scenes/BattlePhaseScene.js';

Telegram.WebApp.ready();
Telegram.WebApp.expand();

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  scene: [
    HomeScene,
    ShopScene,
    CardsScene,
    BattleScene,
    BattlePhaseScene,
    HelpScene
  ]
};

new Phaser.Game(config);

