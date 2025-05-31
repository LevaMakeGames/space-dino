export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    this.add.text(this.cameras.main.centerX, 40, 'BOOSTER SHOP', {
      fontSize: '22px',
      color: '#fff'
    }).setOrigin(0.5);

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

    const buttonWidth = 200;
    const buttonHeight = 50;
    const startY = 100;
    const spacingY = 60;

    boosters.forEach((booster, i) => {
      const x = this.cameras.main.centerX;
      const y = startY + i * spacingY;

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

    this.addNavigation();
  }

  addNavigation() {
    const names = ['Home', 'Shop', 'Battle', 'Help'];
    names.forEach((name, i) => {
      const btn = this.add.text(80 * i + 20, this.scale.height - 40, name, {
        fontSize: '18px',
        backgroundColor: '#444',
        padding: 5,
        fill: '#fff'
      }).setInteractive();
      btn.on('pointerdown', () => this.scene.start(name));
    });
  }
}
