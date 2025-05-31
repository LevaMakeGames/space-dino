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

    // Данные бустеров
    const boosters = [
      { label: 'FARM x2', key: 'boosterFarm' },
      { label: 'AUTO CLICK', key: 'boosterAuto' },
      { label: 'DOUBLE TAP', key: 'boosterSpeed' },
      { label: 'LUCKY DINO', key: 'boosterLuck' },
      { label: 'GOLDEN TOUCH', key: 'boosterGold' }
    ];

    const buttonWidth = 200;
    const buttonHeight = 65; // Увеличено на 30%
    const spacingY = 20;

    const totalHeight = boosters.length * buttonHeight + (boosters.length - 1) * spacingY;
    const startY = this.cameras.main.centerY - totalHeight / 2;

    // Кнопки бустеров
    boosters.forEach((booster, i) => {
      const x = this.cameras.main.centerX;
      const y = startY + i * (buttonHeight + spacingY);

      const bg = this.add.image(0, 0, 'menuBtn')
        .setDisplaySize(buttonWidth, buttonHeight)
        .setOrigin(0.5);

      const label = this.add.text(0, 0, booster.label, {
        fontSize: '18px',
        color: '#fff'
      }).setOrigin(0.5);

      const btn = this.add.container(x, y, [bg, label])
        .setSize(buttonWidth, buttonHeight)
        .setInteractive();

      btn.on('pointerdown', () => {
        window.boosters[booster.key] = true;
        console.log(`✅ ${booster.label} activated`);
      });
    });

    // Кнопка BACK
    const backBtn = this.add.text(20, 20, '← BACK', {
      fontSize: '20px',
      backgroundColor: '#444',
      padding: { left: 10, right: 10, top: 4, bottom: 4 },
      color: '#fff'
    }).setInteractive();

    backBtn.on('pointerdown', () => this.scene.start('Home'));
  }
}
