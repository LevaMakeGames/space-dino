export default class ShopScene extends Phaser.Scene {
  constructor() { super('Shop'); }

  create() {
    this.add.text(100, 100, '🛒 Магазин: купи бустер за 49 Stars', { fontSize: '18px', fill: '#fff' });

    const buy = this.add.text(100, 150, '[ Купить ]', { fontSize: '20px', fill: '#0ff' }).setInteractive();
    buy.on('pointerdown', () => {
      Telegram.WebApp.openInvoice({
        provider_token: "", // боевой токен — если есть
        title: "Booster Pack",
        description: "3 случайные карты",
        payload: "booster1",
        currency: "XTR",
        prices: [{ label: "Booster", amount: 4900 }]
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
