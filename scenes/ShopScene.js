export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    this.add.text(100, 50, '🛒 Магазин бустеров (тест)', { fontSize: '18px', fill: '#fff' });

    if (!window.boosters) {
      window.boosters = {
        boosterFarm: false,
        boosterSpeed: false,
        boosterAuto: false,
        boosterLuck: false,
        boosterDefense: false
      };
    }

    const boosters = [
      { label: 'Фарм x2', key: 'boosterFarm', y: 100 },
      { label: 'Скорость', key: 'boosterSpeed', y: 150 },
      { label: 'Автоклик', key: 'boosterAuto', y: 200 },
      { label: 'Удача', key: 'boosterLuck', y: 250 },
      { label: 'Защита', key: 'boosterDefense', y: 300 }
    ];

    boosters.forEach(({ label, key, y }) => {
      const btn = this.add.text(100, y, `[ Купить ${label} ]`, {
        fontSize: '18px',
        fill: '#0ff'
      }).setInteractive();

      btn.on('pointerdown', () => {
        window.boosters[key] = true;
        console.log(`✅ ${label} активирован`);
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
