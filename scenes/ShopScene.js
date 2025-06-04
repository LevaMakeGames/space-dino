export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    const { width, height, centerX } = this.cameras.main;

    // Стартовые алмазы
    if (window.diamonds === undefined) window.diamonds = 300;

    // Инициализация бустеров
    if (!window.boosters) {
      window.boosters = {
        boosterFarm: false,
        boosterSpeed: false,
        boosterAuto: false,
        boosterLuck: false,
        boosterGold: false
      };
    }

    // Верхняя панель
    const panelY = 30;

    // Кнопка "Назад"
    const backBtn = this.add.text(20, panelY, '← BACK', {
      fontSize: '20px',
      fontFamily: 'Rajdhani',
      backgroundColor: '#1e90ff',
      padding: { left: 12, right: 12, top: 6, bottom: 6 },
      color: '#fff'
    }).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => this.scene.start('Home'));

    // Счётчик алмазов
    const diamondText = this.add.text(width - 20, panelY, `💎 ${window.diamonds}`, {
      fontSize: '20px',
      fontFamily: 'Rajdhani',
      color: '#fff',
      backgroundColor: '#1e90ff',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(1, 0);

    // Заголовок
    this.add.text(centerX, panelY + 60, 'BOOSTER SHOP', {
      fontSize: '28px',
      fontFamily: 'Rajdhani',
      color: '#fff'
    }).setOrigin(0.5);

    // Данные бустеров
    const boosters = [
      { label: 'FARM x2', key: 'boosterFarm', desc: 'Больше монет за клик', cost: 100 },
      { label: 'AUTO CLICK', key: 'boosterAuto', desc: 'Автокликер', cost: 100 },
      { label: 'DOUBLE TAP', key: 'boosterSpeed', desc: 'Удваивает клики', cost: 100 },
      { label: 'LUCKY DINO', key: 'boosterLuck', desc: 'Шанс бонуса', cost: 100 },
      { label: 'GOLDEN TOUCH', key: 'boosterGold', desc: 'Каждый 5-й клик — +10', cost: 100 }
    ];

    const buttonWidth = 240;
    const buttonHeight = 80;
    const spacingY = 20;

    const totalHeight = boosters.length * (buttonHeight + spacingY);
    const startY = panelY + 120;

    // Кнопки бустеров
    boosters.forEach((booster, i) => {
      const x = centerX;
      const y = startY + i * (buttonHeight + spacingY);
      const isActive = window.boosters[booster.key];
      const bgColor = isActive ? 0x00aa00 : 0x1e90ff;

      const bg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, bgColor)
        .setStrokeStyle(2, 0xffffff)
        .setOrigin(0.5);

      const title = this.add.text(0, -16, booster.label, {
        fontSize: '20px',
        fontFamily: 'Rajdhani',
        color: '#fff'
      }).setOrigin(0.5);

      const desc = this.add.text(0, 10, `${booster.desc}  💎${booster.cost}`, {
        fontSize: '18px',
        fontFamily: 'Rajdhani',
        color: '#fff'
      }).setOrigin(0.5);

      const container = this.add.container(x, y, [bg, title, desc])
        .setSize(buttonWidth, buttonHeight)
        .setInteractive({ useHandCursor: true });

      container.on('pointerdown', () => {
        if (window.boosters[booster.key]) return;

        if (window.diamonds >= booster.cost) {
          window.diamonds -= booster.cost;
          window.boosters[booster.key] = true;
          diamondText.setText(`💎 ${window.diamonds}`);
          bg.setFillStyle(0x00aa00);
        } else {
          // Недостаточно алмазов — краткая анимация
          this.tweens.add({
            targets: container,
            x: x + 5,
            duration: 60,
            yoyo: true,
            repeat: 1
          });
        }
      });
    });
  }
}
