export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  preload() {
    for (let i = 1; i <= 9; i++) {
      this.load.image(`card_${i}`, `https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_${i}.png`);
    }
  }

  create() {
    if (window.coins == null) window.coins = 200;

    this.cardData = [
      { id: 1, element: 'fire', name: 'Flame Horn' },
      { id: 2, element: 'water', name: 'Ice Fang' },
      { id: 3, element: 'earth', name: 'Stone Spike' },
      { id: 4, element: 'air', name: 'Wind Dash' },
      { id: 5, element: 'fire', name: 'Ash Burst', special: 'vs_earth_20' },
      { id: 6, element: 'water', name: 'Calm Water', special: 'draw_air' },
      { id: 7, element: 'earth', name: 'Clay Core', special: 'win_vs_earth' },
      { id: 8, element: 'air', name: 'Storm Slice', special: 'win_vs_water' },
      { id: 9, element: 'secret', name: 'Secret Card', special: 'secret_power' }
    ].map(c => ({ ...c, price: 50 + c.id * 10, count: 0 }));

    this.selectedCards = [];
    this.roundResults = [];

    const { centerX, width, height } = this.cameras.main;

    this.add.text(20, 20, '← BACK', {
      fontSize: '20px',
      backgroundColor: '#444',
      padding: { left: 10, right: 10, top: 4, bottom: 4 },
      color: '#fff'
    }).setInteractive().on('pointerdown', () => this.scene.start('Home'));

    this.coinsText = this.add.text(width - 20, 20, `Coins: ${window.coins}`, {
      fontSize: '20px',
      color: '#fff'
    }).setOrigin(1, 0);

    this.add.text(centerX, 60, 'Choose your cards', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.createCardGrid();

    this.statusText = this.add.text(centerX, height - 30, 'Selected: 0 / 3', {
      fontSize: '24px',
      color: '#00ff00'
    }).setOrigin(0.5);
  }

  createCardGrid() {
    const cols = 3;
    const spacing = 20;
    const size = 100;
    const scale = size / 256;
    const centerX = this.cameras.main.centerX;
    const startX = centerX - (cols * (size + spacing) - spacing) / 2;
    const startY = 90;

    this.cardData.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (size + spacing);
      const y = startY + row * (size + spacing);
      const xPos = x + size / 2;
      const yPos = y + size / 2;

      const img = this.add.image(xPos, yPos, `card_${card.id}`)
        .setScale(scale)
        .setInteractive();

      const countText = this.add.text(xPos, y + 6, `x${card.count}`, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);

      const priceText = this.add.text(xPos, y + size - 10, `${card.price} $`, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);

      img.on('pointerdown', () => this.handlePurchase(card, img, priceText));
    });
  }

  handlePurchase(card, img, label) {
    if (this.selectedCards.length >= 3 || this.selectedCards.includes(card)) return;

    if (window.coins < card.price) {
      label.setColor('#ff4444');
      return;
    }

    window.coins -= card.price;
    this.coinsText.setText(`Coins: ${window.coins}`);
    img.setTint(0x00ff00);
    label.setColor('#00ff00');

    this.selectedCards.push(card);
    this.statusText.setText(`Selected: ${this.selectedCards.length} / 3`);

    if (this.selectedCards.length === 3) {
      this.time.delayedCall(1000, () => this.startBattle());
    }
  }

  startBattle() {
    this.scene.start('Home'); // заменишь на свою боевую сцену позже
  }
}
