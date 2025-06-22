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

    this.load.image('b_0', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/b_0.png');
    this.load.image('b_1', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/b_1.png');
    this.load.image('b_2', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/b_2.png');
    this.load.image('b_3', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/b_3.png');
    this.load.image('b_4', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/b_4.png');
    this.load.image('b_5', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/b_5.png');
  }

  create() {
    // Инициализация валют
    if (window.coins == null) window.coins = 0;
    if (window.gems == null) window.gems = 0;

    if (!window.boosters) {
      window.boosters = {
        boosterFarm: false,
        boosterSpeed: false,
        boosterAuto: false,
        boosterLuck: false,
        boosterGold: false
      };
    }

    const { centerX, centerY, width, height } = this.cameras.main;

    // Фон
    const bg = this.add.image(0, 0, 'bg').setOrigin(0);
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setDepth(0);

    // Красивый фон под балансом
    const balanceBg = this.add.rectangle(20, 20, 200, 50, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setDepth(2)
      .setStrokeStyle(2, 0xffffff, 0.8)
      .setCornerRadius ? this.add.rectangle(20, 20, 200, 50, 0x000000, 0.5).setOrigin(0, 0).setDepth(2) : null;

    // Текст баланса
    const balanceText = this.add.text(30, 30, `💰 ${window.coins}   💎 ${window.gems}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setDepth(3);

    // Динозавр
    const dino = this.add.image(centerX, centerY + 100, 'dino_open').setDepth(1);
    this.dinoTween = null;

    // Моргание
    this.time.addEvent({
      delay: Phaser.Math.Between(3000, 6000),
      loop: true,
      callback: () => {
        dino.setTexture('dino_closed');
        this.time.delayedCall(150, () => dino.setTexture('dino_open'));
      }
    });

    // Автокликер
    if (window.boosters.boosterAuto) {
      this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          window.coins++;
          balanceText.setText(`💰 ${window.coins}   💎 ${window.gems}`);
        }
      });
    }

    // Клик
    let clickCount = 0;

    this.input.on('pointerdown', () => {
      if (this.dinoTween && this.dinoTween.isPlaying()) return;

      this.dinoTween = this.tweens.add({
        targets: dino,
        scaleX: 1.1,
        scaleY: 0.9,
        angle: -5,
        yoyo: true,
        duration: 100
      });

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

      let clickValue = 1;
      clickCount++;

      if (window.boosters.boosterFarm) clickValue += 1;
      if (window.boosters.boosterSpeed) clickValue *= 2;
      if (window.boosters.boosterLuck && Math.random() < 0.25) clickValue += 3;
      if (window.boosters.boosterGold && clickCount % 5 === 0) clickValue += 10;

      window.coins += clickValue;

      // Случайный бонус к алмазам (5% шанс)
      if (Math.random() < 0.05) window.gems += 1;

      balanceText.setText(`💰 ${window.coins}   💎 ${window.gems}`);
    });

    // Спрайты бустеров
    const boosterKeys = [
      'boosterFarm',
      'boosterAuto',
      'boosterSpeed',
      'boosterLuck',
      'boosterGold'
    ];

    const icons = boosterKeys.map((key, i) =>
      window.boosters[key] ? `b_${i + 1}` : 'b_0'
    );

    const spriteSize = 100;
    const spacing = 30;
    const topOffset = height * 0.2 - 20;

    const positions = [
      { x: centerX - spriteSize - spacing, y: topOffset },
      { x: centerX,                        y: topOffset },
      { x: centerX + spriteSize + spacing, y: topOffset },
      { x: centerX - spriteSize / 2 - spacing / 2, y: topOffset + spriteSize + spacing },
      { x: centerX + spriteSize / 2 + spacing / 2, y: topOffset + spriteSize + spacing }
    ];

    icons.forEach((iconKey, i) => {
      this.add.image(positions[i].x, positions[i].y, iconKey)
        .setDisplaySize(spriteSize, spriteSize)
        .setOrigin(0.5)
        .setDepth(0.5);
    });

    this.addNavigation();
  }

  addNavigation() {
    const buttons = [
      { name: 'Shop', label: 'SHOP' },
      { name: 'Cards', label: 'CARDS' },
      { name: 'Battle', label: 'BATTLE' },
      { name: 'About', label: 'ABOUT' }
    ];

    const padding = 10;
    const buttonHeight = 64;
    const y = this.scale.height - 50;

    const buttonCount = buttons.length;
    const totalSpacing = padding * (buttonCount + 1);
    const availableWidth = this.scale.width - totalSpacing;
    const buttonWidth = availableWidth / buttonCount;

    buttons.forEach((btn, i) => {
      const x = padding + i * (buttonWidth + padding);

      const bg = this.add.image(0, 0, 'menuBtn')
        .setDisplaySize(buttonWidth, buttonHeight)
        .setOrigin(0.5);

      const label = this.add.text(0, 0, btn.label, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#fff',
        align: 'center',
        wordWrap: { width: buttonWidth - 10 }
      }).setOrigin(0.5);

      const container = this.add.container(x + buttonWidth / 2, y, [bg, label])
        .setSize(buttonWidth, buttonHeight)
        .setInteractive()
        .setDepth(3);

      container.on('pointerdown', () => this.scene.start(btn.name));
    });
  }
}
