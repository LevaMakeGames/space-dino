export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    const { centerX, width } = this.cameras.main;

    if (!window.diamonds) window.diamonds = 300;

    if (!window.boosters) {
      window.boosters = {
        boosterFarm: false,
        boosterSpeed: false,
        boosterAuto: false,
        boosterLuck: false,
        boosterGold: false
      };
    }

    // 🔙 Назад слева
    const backBox = this.add.rectangle(70, 22, 100, 36, 0x333333, 0.8)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff);
    const backText = this.add.text(70, 22, '← BACK', {
      fontSize: '18px',
      fontFamily: 'Rajdhani',
      color: '#fff'
    }).setOrigin(0.5);
    this.add.container(0, 0, [backBox, backText])
      .setSize(100, 36)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Home'));

    // 💎 Алмазы справа
    this.add.text(width - 100, 22, '💎', {
      fontSize: '22px',
      fontFamily: 'Rajdhani'
    }).setOrigin(0.5);
    this.diamondText = this.add.text(width - 70, 22, `${window.diamonds}`, {
      fontSize: '22px',
      fontFamily: 'Rajdhani',
      color: '#fff'
    }).setOrigin(0, 0.5);

    // 🏷️ Заголовок
    this.add.text(centerX, 100, 'BOOSTER SHOP', {
      fontSize: '26px',
      fontFamily: 'Rajdhani',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 🔘 Бустеры
    const boosters = [
      { label: 'FARM x2', desc: 'Doubles income', key: 'boosterFarm' },
      { label: 'AUTO CLICK', desc: 'Clicks every sec', key: 'boosterAuto' },
      { label: 'DOUBLE TAP', desc: 'x2 per click', key: 'boosterSpeed' },
      { label: 'LUCKY DINO', desc: 'Bonus chance', key: 'boosterLuck' },
      { label: 'GOLDEN TOUCH', desc: '+10/5 taps', key: 'boosterGold' }
    ];

    const buttonWidth = 260;
    const buttonHeight = 80;
    const spacingY = 24;
    const startY = 160;

    boosters.forEach((booster, i) => {
      const x = centerX;
      const y = startY + i * (buttonHeight + spacingY);
      const isActive = window.boosters[booster.key];
      const color = isActive ? 0x228B22 : 0x3355aa;

      const bg = this.add.graphics();
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 14);

      const frame = this.add.graphics();
      frame.lineStyle(2, 0xffffff);
      frame.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 14);

      const labelWithPrice = this.add.text(0, -14, `${booster.label}    💎 100`, {
        fontSize: '18px',
        fontFamily: 'Rajdhani',
        color: '#ffffff'
      }).setOrigin(0.5);

      const desc = this.add.text(0, 14, booster.desc, {
        fontSize: '14px',
        fontFamily: 'Rajdhani',
        color: '#dddddd'
      }).setOrigin(0.5);

      const container = this.add.container(x, y, [bg, frame, labelWithPrice, desc])
        .setSize(buttonWidth, buttonHeight)
        .setInteractive(new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

      container.on('pointerdown', () => {
        if (window.boosters[booster.key]) return;

        if (window.diamonds >= 100) {
          window.diamonds -= 100;
          window.boosters[booster.key] = true;
          this.diamondText.setText(`${window.diamonds}`);

          bg.clear();
          bg.fillStyle(0x228B22, 1);
          bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 14);

          this.tweens.add({
            targets: container,
            scaleX: 1.05,
            scaleY: 1.05,
            yoyo: true,
            duration: 100
          });
        } else {
          this.tweens.add({
            targets: container,
            x: x - 10,
            yoyo: true,
            duration: 60,
            repeat: 3,
            onComplete: () => container.setX(x)
          });

          const warn = this.add.text(x, y + 50, 'Not enough diamonds', {
            fontSize: '14px',
            fontFamily: 'Rajdhani',
            color: '#f55'
          }).setOrigin(0.5);

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
