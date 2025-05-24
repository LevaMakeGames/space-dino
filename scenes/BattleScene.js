export default class BattleScene extends Phaser.Scene {
  constructor() { super('Battle'); }

  create() {
    this.add.text(100, 100, '⚔️ Битва: 3 карты сражаются', { fontSize: '18px', fill: '#fff' });

    const result = ['Ты победил!', 'Ты проиграл!'][Math.floor(Math.random() * 2)];
    this.add.text(100, 150, result, { fontSize: '22px', fill: '#f66' });

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
