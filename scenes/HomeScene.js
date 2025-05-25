export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('Home');
  }

  preload() {
    this.load.image('bg', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/dino_bg.png');
    this.load.image('dino_open', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/dino_open.png');
    this.load.image('dino_closed', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/dino_closed.png');
    this.load.image('coin', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/coin.png');
    this.load.image('menuBtn', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/menuBtn.png');
  }

  create() {
    const { centerX, centerY, width, height } = this.cameras.main;

    // Фон
    const bg = this.add.image(0, 0, 'bg').setOrigin(0);
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);
    bg.setDepth(0);

    // Счётчик монет
    let coins = 0;
    const counter = this.add.text(20, 20, 'Coins: 0', {
      fontSize: '24px',
      fill: '#0f0'
    }).setDepth(2);

    // Динозавр
    const dino = this.add.image(centerX, centerY + 100, 'dino_open').setDepth(1);
    this.dinoTween = null;

    // Моргание
    this.time.addEvent({
      delay: Phaser.Math.Between(3000, 6000),
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
      if (this.dinoTween && this.dinoTween.isPlaying()) return;

      // Анимация динозавра
      this.dinoTween = this.tweens.add({
        targets: dino,
        scaleX: 1.1,
        scaleY: 0.9,
        angle: -5,
        yoyo: true,
        duration: 100
      });

      // Монета (поднята выше)
      const coin = this.add.image(dino.x, dino.y - 100, 'coin')
        .setScale(0.5)
        .setDepth(2);
      this.tweens.add({
        targets: coin,
        y: coin.y - 50,
        alpha: 0,
        duration: 500,
        onComplete: () => coin.destroy()
      });

      // Счётчик
      coins++;
      counter.setText(`Coins: ${coins}`);
    });

    this.addNavigation();
  }

  addNavigation() {
    const buttonWidth = 150;
    const buttonHeight = 50;
    const spacing = 20;
    const centerX = this.cameras.main.centerX;
    const bottomY = this.scale.height - 60;

    const buttonNames = ['Home', 'Shop', 'Battle', 'Help'];

    buttonNames.forEach((name, i) => {
      const x = centerX - ((buttonNames.length - 1) * (buttonWidth + spacing)) / 2 + i * (buttonWidth + spacing);
      const y = bottomY;

      const bg = this.add.image(0, 0, 'menuBtn').setDisplaySize(buttonWidth, buttonHeight);
      const label = this.add.text(0, 0, name, {
        fontSize: '18px',
        color: '#fff',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      const container = this.add.container(x, y, [bg, label])
        .setSize(buttonWidth, buttonHeight)
        .setInteractive();

      container.on('pointerdown', () => this.scene.start(name));
    });
  }
}
