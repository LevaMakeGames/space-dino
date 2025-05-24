import HomeScene from './scenes/HomeScene.js';
import ShopScene from './scenes/ShopScene.js';
import BattleScene from './scenes/BattleScene.js';
import HelpScene from './scenes/HelpScene.js';

Telegram.WebApp.ready();
Telegram.WebApp.expand();

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  scene: [HomeScene, ShopScene, BattleScene, HelpScene]
};

new Phaser.Game(config);
