export default class BattlePhaseScene extends Phaser.Scene {
  constructor() {
    super('BattlePhase');
  }

  preload() {
    for (let i = 1; i <= 9; i++) {
      this.load.image(`card_${i}`, `https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_${i}.png`);
    }
  }

  create() {
    if (!window.selectedCards || window.selectedCards.length !== 3) {
      this.scene.start('Home'); // если нет карт — вернуться
      return;
    }

    this.add.text(this.cameras.main.centerX, 20, 'Battle Phase', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.showPlayerCards();
  }

  showPlayerCards() {
    const spacing = 120;
    const centerX = this.cameras.main.centerX;
    const y = this.cameras.main.centerY;

    window.selectedCards.forEach((card, i) => {
      const x = centerX - spacing + i * spacing;
      this.add.image(x, y, `card_${card.id}`).setScale(0.4);
    });
  }
}
