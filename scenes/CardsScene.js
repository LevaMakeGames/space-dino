export default class CardsScene extends Phaser.Scene {
  constructor() {
    super('Cards');
  }

  preload() {
    this.load.image('card_fire', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_fire.png');
  }

  create() {
    if (window.coins == null) window.coins = 200;

    // Только 9 карточек
    if (!window.cardInventory) {
      window.cardInventory = {};
      for (let i = 0; i < 9; i++) {
        window.cardInventory[`card_${i}`] = {
          count: 0,
          cost: 50 + i * 10
        };
      }
    }

    const { centerX, width } = this.cameras.main;

    this.add.text(20, 20, '← BACK', {
      fontSize: '20px',
      backgroundColor: '#444',
      padding: { left: 10, right: 10, top: 4, bottom: 4 },
      color: '#fff'
    }).setInteractive().on('pointerdown', () => this.scene.start('Home'));

    this.add.text(width - 20, 20, `Coins: ${window.coins}`, {
      fontSize: '20px',
      color: '#fff'
    }).setOrigin(1, 0);

    this.textures.get('card_fire').setFilter(Phaser.Textures.FilterMode.NEAREST);

    const texture = this.textures.get('card_fire');
    const sourceImg = texture.getSourceImage();
    const originalWidth = sourceImg.width;
    const originalHeight = sourceImg.height;

    const targetWidth = 100;
    const scale = targetWidth / originalWidth;
    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    const cols = 3;
    const spacing = 20;
    const startX = centerX - (cols * (scaledWidth + spacing) - spacing) / 2;
    const startY = 90; // Было 80 → сдвинуто на 10 пикселей вниз

    Object.entries(window.cardInventory).forEach(([key, card], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (scaledWidth + spacing);
      const y = startY + row * (scaledHeight + spacing);
      const xPos = x + scaledWidth / 2;
      const yPos = y + scaledHeight / 2;

      const cardImg = this.add.image(xPos, yPos, 'card_fire')
        .setScale(scale)
        .setInteractive();

      this.add.text(xPos, y + 6, `x${card.count}`, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);

      this.add.text(xPos, y + scaledHeight - 10, `${card.cost} $`, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);

      cardImg.on('pointerdown', () => {
        if (window.coins >= card.cost) {
          card.count++;
          window.coins -= card.cost;
          this.scene.restart();
        }
      });
    });
  }
}
