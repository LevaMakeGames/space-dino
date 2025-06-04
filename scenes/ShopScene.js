export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    const { centerX, width } = this.cameras.main;

    // 💎 Стартовый бюджет
    if (!window.diamonds) window.diamonds = 300;

    // 🔙 Кнопка назад справа
    const backBox = this.add.rectangle(width - 70, 22, 100, 36, 0x333333, 0.8)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff);
    const backText = this.add.text(width - 70, 22, '← BACK', {
      fontSize: '16px', color: '#fff'
    }).setOrigin(0.5);
    this.add.container(0, 0, [backBox, backText])
      .setSize(100, 36)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Home'));

    // 💎 Слева алмазы
    this.add.text(30, 22, '💎', {
      fontSize: '20px'
    }).setOrigin(0.5);
    this.diamondText = this.add.text(60, 22, `${window.diamonds}`, {
      fontSize: '20px', color: '#fff'
    }).setOrigin(0, 0.5);

    // 🏷️ Заголовок
    this.add.text(centerX, 100, 'BOOSTER SHOP', {
      fontSize: '30px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // ⚙️ Инициализация бустеров
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

    const buttonWidth = 240;
    const buttonHeight = 80;
    const spacingY = 24;
    const startY = 160;

    boosters.forEach((booster, i) => {
      const x = centerX;
      const y = startY + i * (buttonHeight + spacingY);
      const isActive = window.boosters[booster.key];

      const bgColor = isActive ? 0x228B22 : 0x3355aa;

      const bg = this.add.graphics();
      bg.fillStyle(bgColor, 1);
      bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);

      const frame = this.add.graphics();
      frame.lineStyle(2, 0xffffff);
      frame.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);

      const title = this.add.text(0, -14, booster.label, {
        fontSize: '17px',
        color: '#fff'
      }).setOrigin(0.5);

      const desc = this.add.text(0, 12, booster.desc, {
        fontSize: '13px',
        color: '#dddddd'
      }).setOrigin(0.5);

      const priceText = this.add.text(buttonWidth / 2 - 12, -buttonHeight / 2 + 12, '💎 100', {
        fontSize: '13px',
        color: '#fff'
      }).setOrigin(1, 0);

      const container = this.add.container(x, y, [bg, frame, title, desc, priceText])
        .setSize(buttonWidth, buttonHeight)
        .setInteractive(new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

      container.on('pointerdown', () => {
        if (window.boosters[booster.key]) return;

        if (window.diamonds >= 100) {
          window.diamonds -= 100;
          window.boosters[booster.key] = true;
          this.diamondText.setText(`${window.diamonds}`);

          // перекрасить
          bg.clear();
          bg.fillStyle(0x228B22, 1);
          bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);

          // лёгкая анимация
          this.tweens.add({
            targets: container,
            scaleX: 1.05,
            scaleY: 1.05,
            yoyo: true,
            duration: 100
          });
        } else {
          // тряска + предупреждение
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
