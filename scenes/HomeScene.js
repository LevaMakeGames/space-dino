export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('Home');
  }

  preload() {
  this.load.image('dino_open', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/dino_open.png');
  this.load.image('dino_closed', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/dino_closed.png');
  this.load.image('coin', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/coin.png');
}

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Заголовок
    this.add.text(100, 100, '🏠 Дом: нажимай, чтобы заработать', {
      fontSize: '18px',
      fill: '#fff'
    });

    // Счётчик монет
    let coins = 0;
    const counter = this.add.text(100, 150, 'Coins: 0', {
      fontSize: '24px',
      fill: '#0f0'
    });

    // Динозавр
    const dino = this.add.image(centerX, centerY, 'dino_open');

    // Моргание (смена текстуры)
    this.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      loop: true,
      callback: () => {
        dino.setTexture('dino_closed');
        this.time.delayedCall(150, () => {
          dino.setTexture('dino_open');
        });
      }
    });

    // Клик по экрану
    this.input.on('pointerdown', () => {
      // Анимация динозавра
      // this.tweens.add({
      //   targets: dino,
      //   scaleX: 1.1,
      //   scaleY: 0.9,
      //   angle: -5,
      //   yoyo: true,
      //   duration: 100
      // });

      // Монета, вылетающая из динозавра
      const coin = this.add.image(dino.x, dino.y - 150, 'coin').setScale(0.5);
      this.tweens.add({
        targets: coin,
        y: coin.y - 50,
        alpha: 0,
        duration: 800,
        onComplete: () => coin.destroy()
      });

      // Обновление счётчика
      coins++;
      counter.setText(`Coins: ${coins}`);
    });

    // Кнопки навигации
    this.addNavigation();
  }

  addNavigation() {
    const names = ['Home', 'Shop', 'Battle', 'Help'];
    names.forEach((name, i) => {
      const btn = this.add.text(80 * i + 20, this.scale.height - 40, name, {
        fontSize: '18px',
        backgroundColor: '#444',
        padding: 5,
        fill: '#fff'
      }).setInteractive();
      btn.on('pointerdown', () => this.scene.start(name));
    });
  }
}
