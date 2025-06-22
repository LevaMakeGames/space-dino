export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  preload() {
    for (let i = 1; i <= 9; i++) {
      this.load.image(`card_${i}`, `https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_${i}.png`);
    }
    // Загружаем иконку монетки
    this.load.image('coinDino', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/coinDino.png');
  }

  create() {
    if (window.coins == null) window.coins = 500;

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
    ].map(c => ({ ...c, price: 50 + c.id * 10 }));

    this.selectedCards = [];

    // Заголовок
    this.add.text(this.cameras.main.centerX, 20, 'Choose your cards', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Иконка монетки + количество монет под заголовком
    this.coinIcon = this.add.image(this.cameras.main.centerX - 20, 60, 'coinDino').setScale(0.5);
    this.coinsText = this.add.text(this.cameras.main.centerX + 20, 50, `${window.coins}`, {
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    this.createCardGrid();

    this.statusText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 40,
      'Selected: 0 / 3', {
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
    const startY = 100; // было 80, сместили вниз на 20

    this.cardData.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (size + spacing);
      const y = startY + row * (size + spacing);

      const img = this.add.image(x + size / 2, y + size / 2, `card_${card.id}`)
        .setScale(scale)
        .setInteractive();

      // Значок монетки вместо $
      const priceIcon = this.add.image(x + size / 2 - 15, y + size + 8, 'coinDino').setScale(0.3);
      const priceText = this.add.text(x + size / 2 + 10, y + size + 4, `${card.price}`, {
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0, 0.5);

      img.on('pointerdown', () => this.handlePurchase(card, img, priceText));
    });
  }

  handlePurchase(card, img, label) {
    if (this.selectedCards.length >= 3 || this.selectedCards.includes(card)) return;

    if (window.coins < card.price) {
      label.setColor('#ff4444'); // не хватает монет
      return;
    }

    window.coins -= card.price;
    this.coinsText.setText(`${window.coins}`);
    img.setTint(0x00ff00);
    label.setColor('#00ff00');

    this.selectedCards.push(card);
    this.statusText.setText(`Selected: ${this.selectedCards.length} / 3`);

    if (this.selectedCards.length === 3) {
      this.time.delayedCall(1000, () => this.startBattle());
    }
  }

  startBattle() {
    window.selectedCards = this.selectedCards;
    this.scene.start('BattlePhase'); // переход в новую сцену боя
  }
}
