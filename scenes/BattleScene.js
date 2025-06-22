export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  preload() {
    for (let i = 1; i <= 9; i++) {
      this.load.image(`card_${i}`, `https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_${i}.png`);
    }
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

    // Монетка + баланс по центру
    this.coinIcon = this.add.image(this.cameras.main.centerX - 20, 60, 'coinDino').setScale(0.5);
    this.coinsText = this.add.text(this.cameras.main.centerX + 20, 60, `${window.coins}`, {
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
    const spacingX = 20;   // горизонтальный отступ
    const spacingY = 30;   // вертикальный отступ
    const size = 120;      // размер карт
    const scale = size / 256;

    const centerX = this.cameras.main.centerX;
    const startX = centerX - (cols * (size + spacingX) - spacingX) / 2;
    const startY = 120;

    this.cards = [];

    this.cardData.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (size + spacingX);
      const y = startY + row * (size + spacingY);

      const img = this.add.image(x + size / 2, y + size / 2, `card_${card.id}`)
        .setScale(scale)
        .setInteractive();

      const priceIcon = this.add.image(x + size / 2 - 20, y + size + 12, 'coinDino')
        .setScale(0.3).setOrigin(1, 0.5);
      const priceText = this.add.text(x + size / 2 - 15, y + size + 12, `${card.price}`, {
        fontSize: '18px',
        color: '#ffffff'
      }).setOrigin(0, 0.5);

      this.cards.push({ img, priceIcon, priceText });

      img.on('pointerdown', () => this.handlePurchase(card, img, priceIcon, priceText));
    });
  }

  handlePurchase(card, img, priceIcon, priceText) {
    if (this.selectedCards.length >= 3 || this.selectedCards.includes(card)) return;

    if (window.coins < card.price) {
      priceText.setColor('#ff4444'); // не хватает монет
      return;
    }

    window.coins -= card.price;
    this.coinsText.setText(`${window.coins}`);

    // ✅ Убираем цену и иконку
    priceIcon.destroy();
    priceText.destroy();

    // ✅ Прямоугольная рамка по фактическим размерам
    const border = this.add.rectangle(
      img.x,
      img.y,
      img.width * img.scaleX + 12,
      img.height * img.scaleY + 12
    ).setStrokeStyle(2, 0xffff00);

    // ✅ Галочка в угол карты
    const check = this.add.text(
      img.x + img.width * img.scaleX / 2 - 10,
      img.y - img.height * img.scaleY / 2 + 10,
      '✅',
      { fontSize: '20px' }
    ).setOrigin(0.5).setDepth(2);

    this.selectedCards.push(card);
    this.statusText.setText(`Selected: ${this.selectedCards.length} / 3`);

    if (this.selectedCards.length === 3) {
      this.time.delayedCall(1000, () => this.startBattle());
    }
  }

  startBattle() {
    window.selectedCards = this.selectedCards;
    this.scene.start('BattlePhase');
  }
}
