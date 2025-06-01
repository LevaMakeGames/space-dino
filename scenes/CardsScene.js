export default class CardsScene extends Phaser.Scene {
  constructor() {
    super('Cards');
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

    // Отображение 12 карт
    const cols = 3;
    const cardWidth = 100;
    const cardHeight = 120;
    const spacing = 20;
    const startX = centerX - (cols * (cardWidth + spacing) - spacing) / 2;
    const startY = 80;

    Object.entries(window.cardInventory).forEach(([key, card], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      // Карточка (прямоугольник)
      const bgColor = window.coins >= card.cost ? 0x4444aa : 0x222222;
      const cardBg = this.add.rectangle(x, y, cardWidth, cardHeight, bgColor).setOrigin(0, 0).setInteractive();

      // Количество
      this.add.text(x + cardWidth / 2, y + 20, `x${card.count}`, {
        fontSize: '16px',
        color: '#fff'
      }).setOrigin(0.5);

      // Стоимость
      this.add.text(x + cardWidth / 2, y + cardHeight - 20, `${card.cost} $`, {
        fontSize: '16px',
        color: '#fff'
      }).setOrigin(0.5);

      // Обработчик покупки
      cardBg.on('pointerdown', () => {
        if (window.coins >= card.cost) {
          card.count++;
          window.coins -= card.cost;
          this.scene.restart(); // перерисовать сцену
        }
      });
    });
  }
}

