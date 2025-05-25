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
  const buttonNames = ['Home', 'Shop', 'Battle', 'Help'];
  const spacing = 16;
  const padding = 40;
  const y = this.scale.height - 60;
  const availableWidth = this.scale.width - padding * 2;
  const maxButtonWidth = (availableWidth - spacing * (buttonNames.length - 1)) / buttonNames.length;

  buttonNames.forEach((name, i) => {
    const x = padding + i * (maxButtonWidth + spacing);

    const bg = this.add.image(0, 0, 'menuBtn').setOrigin(0.5);
    const scale = maxButtonWidth / bg.width;
    bg.setScale(scale);

    const label = this.add.text(0, 0, name, {
      fontSize: '18px',
      color: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const container = this.add.container(x + maxButtonWidth / 2, y, [bg, label])
      .setSize(bg.width * scale, bg.height * scale)
      .setInteractive()
      .setDepth(3);

    container.on('pointerdown', () => this.scene.start(name));
  });
}


}
