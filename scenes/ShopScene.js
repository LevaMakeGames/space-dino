export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    // Заголовок
    this.add.text(this.cameras.main.centerX, 40, 'BOOSTER SHOP', {
      fontSize: '22px',
      color: '#fff'
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
    const startY = this.cameras.main.centerY - totalHeight / 2;

    // Кастомные кнопки бустеров
    boosters.forEach((booster, i) => {
      const x = this.cameras.main.centerX;
      const y = startY + i * (buttonHeight + spacingY);
      this.createBoosterButton(x, y, booster.label, () => {
        window.boosters[booster.key] = true;
        console.log(`✅ ${booster.label} activated`);
      });
    });

    // BACK
    const backBtn = this.add.text(20, 20, '← BACK', {
      fontSize: '20px',
      backgroundColor: '#444',
      padding: { left: 10, right: 10, top: 4, bottom: 4 },
      color: '#fff'
    }).setInteractive();
    backBtn.on('pointerdown', () => this.scene.start('Home'));
  }

  createBoosterButton(x, y, label, onClick) {
    const width = 220;
    const height = 65;
    const radius = 12;

    const graphics = this.add.graphics();
    graphics.fillStyle(0x3355aa, 1);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, radius);

    const container = this.add.container(x, y);
    container.add(graphics);

    const text = this.add.text(0, 0, label, {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    container.add(text);

    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    container.on('pointerdown', onClick);

    return container;
  }
}
