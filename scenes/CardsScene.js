export default class CardsScene extends Phaser.Scene {
  constructor() {
    super('Cards');
  }

  preload() {
    // Загружаем одну картинку для всех карточек
    this.load.image('card_fire', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_fire.png');
  }

  create() {
    // Инициализация монет и карт
    if (window.coins == null) window.coins = 200;
    if (!window.cardInventory) {
      window.cardInventory = {};
      for (let i = 0; i < 12; i++) {
        window.cardInventory[`card_${i}`] = {
          count: 0,
          cost: 50 + i * 10
        };
      }
    }

    const { centerX, width } = this.cameras.main;

    // BACK кнопка
    const backBtn = this.add.text(20, 20, '← BACK', {
      fontSize: '20px',
      backgroundColor: '#444',
      padding: { left: 10, right: 10, top: 4, bottom: 4 },
      color: '#fff'
    }).setInteractive();
    backBtn.on('pointerdown', () => this.scene.start('Home'));

    // COINS справа
    const coinText = this.add.text(width - 20, 20, `Coins: ${window.coins}`, {
      fontSize: '20px',
      color: '#fff'
    }).setOrigin(1, 0);

    // Получаем размеры оригинального изображения
    const texture = this.textures.get('card_fire');
    const sourceImg = texture.getSourceImage();
    const originalWidth = sourceImg.width;
    const originalHeight = sourceImg.height;

    // Размер, в который вписываем по ширине
    const targetWidth = 100;
    const scale = targetWidth / originalWidth;
    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    // Сетка
    const cols = 3;
    const spacing = 20;
    const startX = centerX - (cols * (scaledWidth + spacing) - spacing) / 2;
    const startY = 80;

    Object.entries(window.cardInventory).forEach(([key, card], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (scaledWidth + spacing);
      const y = startY + row * (scaledHeight + spacing);
      const xPos = x + scaledWidth / 2;
      const yPos = y + scaledHeight / 2;

      // Карта
      const cardImg = this.add.image(xPos, yPos, 'card_fire')
        .setScale(scale)
        .setInteractive();

      // Кол-во
      this.add.text(xPos, y + 6, `x${card.count}`, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);

      // Стоимость
      this.add.text(xPos, y + scaledHeight - 10, `${card.cost} $`, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(0.5);

      // Покупка
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
