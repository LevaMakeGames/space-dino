export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    const { centerX, width } = this.cameras.main;

    // Валюта и бюджет
    if (!window.diamonds) window.diamonds = 300;
    const diamondText = this.add.text(60, 22, `${window.diamonds}`, {
      fontSize: '20px', color: '#fff'
    }).setOrigin(0, 0.5);
    this.add.text(30, 22, '💎', {
      fontSize: '20px'
    }).setOrigin(0.5);

    // BACK кнопка
    const backBox = this.add.rectangle(width - 80, 22, 100, 36, 0x333333, 0.8)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff);
    const backText = this.add.text(width - 80, 22, '← BACK', {
      fontSize: '16px', color: '#fff'
    }).setOrigin(0.5);
    this.add.container(0, 0, [backBox, backText])
      .setSize(100, 36)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Home'));

    // Заголовок
    this.add.text(centerX, 70, 'BOOSTER SHOP', {
      fontSize: '28px', color: '#fff'
    }).setOrigin(0.5);

    // Инициализация бустеров
    if (!window.boosters) {
      window.boosters = {
        boosterFarm: false,
        boosterSpeed: false,
        boosterAuto: false,
        boosterLuck: false,
        boosterGold: false
      };
    }

    const boosters = [
      { label: 'FARM x2', desc: 'Doubles income', key: 'boosterFarm' },
      { label: 'AUTO CLICK', desc: 'Clicks every sec', key: 'boosterAuto' },
      { label: 'DOUBLE TAP', desc: 'x2 per click', key: 'boosterSpeed' },
      { label: 'LUCKY DINO', desc: 'Bonus chance', key: 'boosterLuck' },
      { label: 'GOLDEN TOUCH', desc: '+10/5 taps', key: 'boosterGold' }
    ];

    const buttonWidth = 220;
    const buttonHeight = 70;
    const spacingY = 24;
    const startY = 130;

    boosters.forEach((booster, i) => {
      const x = centerX;
      const y = startY + i * (buttonHeight + spacingY);
      const isActive = window.boosters[booster.key];

      const bg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, isActive ? 0x007700 : 0x444444)
        .setStrokeStyle(2, 0xffffff)
        .setOrigin(0.5);

      const title = this.add.text(0, -12, booster.label, {
        fontSize: '16px', color: '#fff'
      }).setOrigin(0.5);

      const desc = this.add.text(0, 10, booster.desc, {
        fontSize: '13px', color: '#dddddd'
      }).setOrigin(0.5);

      const priceText = this.add.text(buttonWidth / 2 - 40, 0, '💎 100', {
        fontSize: '14px', color: '#fff'
      }).setOrigin(0.5);

      const btn = this.add.container(x, y, [bg, title, desc, priceText])
        .setSize(buttonWidth, buttonHeight)
        .setInteractive();

      btn.on('pointerdown', () => {
        if (window.boosters[booster.key]) return;

        if (window.diamonds >= 100) {
          window.diamonds -= 100;
          window.boosters[booster.key] = true;
          diamondText.setText(`${window.diamonds}`);
          bg.setFillStyle(0x007700);

          this.tweens.add({
            targets: btn,
            scaleX: 1.05,
            scaleY: 1.05,
            yoyo: true,
            duration: 100
          });
        } else {
          this.tweens.add({
            targets: btn,
            x: x - 10,
            yoyo: true,
            duration: 60,
            repeat: 3,
            onComplete: () => btn.setX(x)
          });

          const warn = this.add.text(centerX, y + 50, 'Not enough diamonds', {
            fontSize: '14px', color: '#f55'
          }).setOrigin(0.5).setAlpha(1);

          this.tweens.add({
            targets: warn,
            alpha: 0,
            duration: 1000,
            onComplete: () => warn.destroy()
          });
        }
      });
    });
  }
}
