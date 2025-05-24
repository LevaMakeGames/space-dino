export default class HomeScene extends Phaser.Scene {
  constructor() { super('Home'); }

  create() {
    this.add.text(100, 100, '🏠 Дом: нажимай, чтобы заработать', { fontSize: '18px', fill: '#fff' });

    let coins = 0;
    const counter = this.add.text(100, 150, 'Coins: 0', { fontSize: '24px', fill: '#0f0' });
    this.input.on('pointerdown', () => {
      coins++;
      counter.setText(`Coins: ${coins}`);
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
