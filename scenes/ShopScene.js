export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    const width = this.scale.width;

    // 💎 Инициализация алмазов
    if (window.diamonds == null) window.diamonds = 1000;

    // 🔙 BACK кнопка
    this.createFramedButton(80, 40, '← BACK', () => {
      this.scene.start('Home');
    });

    // 💎 Emoji + текст
    this.add.text(width - 120, 40, '💎', {
      fontSize: '24px'
    }).setOrigin(0.5);

    this.add.text(width - 90, 40, `${window.diamonds}`, {
      fontSize: '20px',
      color: '#fff'
    }).setOrigin(0, 0.5);

    // 🛒 Заголовок
    this.add.text(this.cameras.main.centerX, 100, 'BOOSTER SHOP', {
      fontSize: '30px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 🔘 Инициализация бустеров
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
      { label: 'FARM x2', key: 'boosterFarm' },
      { label: 'AUTO CLICK', key: 'boosterAuto' },
      { label: 'DOUBLE TAP', key: 'boosterSpeed' },
      { label: 'LUCKY DINO', key: 'boosterLuck' },
      { label: 'GOLDEN TOUCH', key: 'boosterGold' }
    ];

    const buttonWidth = 220;
    const buttonHeight = 65;
    const spacingY = 20;
    const totalHeight = boosters.length * buttonHeight + (boosters.length - 1) * spacingY;
    const startY = 160 + 50;

    // Кнопки бустеров
    boosters.forEach((booster, i) => {
      const x = this.cameras.main.centerX;
      const y = startY + i * (buttonHeight + spacingY);
      this.createBoosterButton(x, y, booster.label, () => {
        window.boosters[booster.key] = true;
        console.log(`✅ ${booster.label} activated`);
      });
    });
  }

  createFramedButton(x, y, label, onClick) {
    const width = 120;
    const height = 40;
    const radius = 8;

    const bg = this.add.graphics();
    bg.fillStyle(0x444444, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);

    const border = this.add.graphics();
    border.lineStyle(2, 0xffffff);
    border.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);

    const text = this.add.text(0, 0, label, {
      fontSize: '16px',
      color: '#fff'
    }).setOrigin(0.5);

    const container = this.add.container(x, y, [bg, border, text])
      .setSize(width, height)
      .setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    container.on('pointerdown', onClick);
    return container;
  }

  createBoosterButton(x, y, label, onClick) {
    const width = 220;
    const height = 65;
    const radius = 12;

    const bg = this.add.graphics();
    bg.fillStyle(0x3355aa, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);

    const text = this.add.text(0, 0, label, {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const container = this.add.container(x, y, [bg, text])
      .setSize(width, height)
      .setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    container.on('pointerdown', onClick);
    return container;
  }
}
