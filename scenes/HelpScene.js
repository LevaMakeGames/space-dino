export default class HelpScene extends Phaser.Scene {
  constructor() { super('Help'); }

  create() {
    this.add.text(80, 100, '❓ Как играть:', { fontSize: '20px', fill: '#fff' });
    this.add.text(80, 140, '- Кликайте в “Дом” для монет\n- Покупайте бустеры в магазине\n- Бейтесь картами в “Битве”\n- Побеждайте и усиливайтесь', {
      fontSize: '16px',
      fill: '#ccc'
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
