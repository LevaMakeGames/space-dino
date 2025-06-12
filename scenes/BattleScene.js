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
    if (window.coins == null) window.coins = 300; // обновлено

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
    this.roundResults = [];

    const { centerX, width, height } = this.cameras.main;

    // BACK
    this.add.text(20, 20, '← BACK', {
      fontSize: '20px',
      backgroundColor: '#444',
      padding: { left: 10, right: 10, top: 4, bottom: 4 },
      color: '#fff'
    }).setInteractive().on('pointerdown', () => this.scene.start('Home'));

    // Coins
    this.coinsText = this.add.text(width - 20, 20, `Coins: ${window.coins}`, {
      fontSize: '20px',
      color: '#fff'
    }).setOrigin(1, 0);

    // Заголовок
    this.add.text(centerX, 90, 'Choose your cards', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5); // ← опущено +20

    this.createCardGrid();

    // Индикатор выбора
    this.statusText = this.add.text(centerX, height - 30, 'Selected: 0 / 3', {
      fontSize: '24px',
      color: '#00ff00'
    }).setOrigin(0.5);
  }

  createCardGrid() {
    const cols = 3;
    const spacing = 20;
    const size = 105;
    const scale = size / 256;
    const centerX = this.cameras.main.centerX;
    const startX = centerX - (cols * (size + spacing) - spacing) / 2;
    const startY = 120; // ← опущено ещё на 20px

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

      const priceText = this.add.text(xPos, y + size + 8, `${card.price} $`, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);

      img.originalX = img.x; // запоминаем оригинальные координаты
      this.handleCardClick(img, priceText, card);
    });
  }

  handleCardClick(img, label, card) {
    img.on('pointerdown', () => {
      if (this.selectedCards.length >= 3 || this.selectedCards.includes(card)) return;

      if (window.coins < card.price) {
        // Вибрация при нехватке
        this.tweens.add({
          targets: img,
          x: img.originalX + 6,
          duration: 50,
          yoyo: true,
          repeat: 2,
          onComplete: () => {
            img.x = img.originalX;
            label.setColor('#ff4444');
          }
        });
        return;
      }

      // Покупка
      window.coins -= card.price;
      this.coinsText.setText(`Coins: ${window.coins}`);
      label.setColor('#00ff00');

      this.tweens.add({
        targets: img,
        scaleX: img.scaleX * 1.1,
        scaleY: img.scaleY * 1.1,
        duration: 100,
        yoyo: true
      });

      this.selectedCards.push(card);
      this.statusText.setText(`Selected: ${this.selectedCards.length} / 3`);

      if (this.selectedCards.length === 3) {
        this.time.delayedCall(1000, () => this.startBattle());
      }
    });
  }

  startBattle() {
    this.scene.start('Home'); // пока просто назад
  }
}
