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
    let clickCount = 0;
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

    // Эффект: автоклик
    if (window.boosters?.boosterAuto) {
      this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          coins++;
          counter.setText(`Coins: ${coins}`);
        }
      });
    }

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

      // Монета
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

      // Подсчёт монет с учётом бустеров
      let clickValue = 1;
      clickCount++;

      if (window.boosters?.boosterFarm) clickValue += 1;
      if (window.boosters?.boosterSpeed) clickValue *= 2;
      if (window.boosters?.boosterLuck && Math.random() < 0.25) clickValue += 3;
      if (window.boosters?.boosterGold && clickCount % 5 === 0) clickValue += 10;

      coins += clickValue;
      counter.setText(`Coins: ${coins}`);
    });

    // Интерфейс бустеров
    const boosterList = [
      { key: 'boosterFarm', label: 'FARM x2' },
      { key: 'boosterAuto', label: 'AUTO CLICK' },
      { key: 'boosterSpeed', label: 'DOUBLE TAP' },
      { key: 'boosterLuck', label: 'LUCKY DINO' },
      { key: 'boosterGold', label: 'GOLDEN TOUCH' }
    ];

    const boxWidth = 40;
    const boxHeight = 40;
    const spacingY = 20;
    const totalHeight = boosterList.length * boxHeight + (boosterList.length - 1) * spacingY;
    const startY = centerY - totalHeight / 2;
    const boxX = centerX;

    boosterList.forEach((b, i) => {
      const y = startY + i * (boxHeight + spacingY);
      const color = window.boosters?.[b.key] ? 0x00ff00 : 0x666666;

      this.add.rectangle(boxX + 60, y, boxWidth, boxHeight, color).setOrigin(0.5);
      this.add.text(boxX - 60, y, b.label, {
        fontSize: '16px',
        color: '#fff'
      }).setOrigin(1, 0.5);
    });
  }
}
