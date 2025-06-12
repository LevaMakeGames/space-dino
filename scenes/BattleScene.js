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
    ];

    this.selectedCards = [];
    this.enemyCards = [];
    this.roundResults = [];

    this.createCardSelection();
  }

  createCardSelection() {
    const cols = 3;
    const cardWidth = 100;
    const cardHeight = 140;
    const spacing = 20;
    const centerX = this.cameras.main.centerX;
    const startX = centerX - (cols * (cardWidth + spacing) - spacing) / 2;
    const startY = 100;

    this.cardData.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      const img = this.add.image(x + cardWidth / 2, y + cardHeight / 2, `card_${card.id}`)
        .setDisplaySize(cardWidth, cardHeight)
        .setInteractive();

      img.on('pointerdown', () => this.selectCard(card, img));
    });

    this.statusText = this.add.text(centerX, 450, 'Selected: 0 / 3', {
      fontSize: '24px',
      color: '#00ff00'
    }).setOrigin(0.5);
  }

  selectCard(card, img) {
    if (this.selectedCards.length >= 3 || this.selectedCards.includes(card)) return;

    this.selectedCards.push(card);
    img.setTint(0x00ff00);
    this.statusText.setText(`Selected: ${this.selectedCards.length} / 3`);

    if (this.selectedCards.length === 3) {
      this.time.delayedCall(1000, () => this.startBattle());
    }
  }

  startBattle() {
    this.children.removeAll();
    this.enemyCards = this.generateEnemyCards();

    for (let i = 0; i < 3; i++) {
      this.runRound(i);
    }

    this.time.delayedCall(3500, () => this.showResult());
  }

  generateEnemyCards() {
    return this.selectedCards.map(card => {
      const pool = this.cardData.filter(c => c.id !== card.id);
      return Phaser.Utils.Array.GetRandom(pool);
    });
  }

  runRound(index) {
    const player = this.selectedCards[index];
    const enemy = this.enemyCards[index];
    const result = this.getBattleResult(player, enemy);
    this.roundResults.push(result);

    const centerX = this.cameras.main.centerX;
    const spacing = 160;
    const x = centerX - spacing + index * spacing;
    const yPlayer = this.cameras.main.centerY + 100;
    const yEnemy = this.cameras.main.centerY - 100;

    const rectPlayer = this.add.rectangle(x, yPlayer, 100, 140, 0x222222).setStrokeStyle(2, 0xffffff);
    const rectEnemy = this.add.rectangle(x, yEnemy, 100, 140, 0x444444).setStrokeStyle(2, 0xffffff);

    const symbol = { win: '✔', lose: '❌', draw: '=' }[result];
    const color = { win: 0x00ff00, lose: 0xff0000, draw: 0xaaaaaa }[result];

    this.time.delayedCall(500 + index * 500, () => {
      rectPlayer.setStrokeStyle(4, color);
      rectEnemy.setStrokeStyle(4, color);
      this.add.text(x, this.cameras.main.centerY, symbol, {
        fontSize: '32px',
        color: '#ffffff'
      }).setOrigin(0.5);
    });
  }

  getBattleResult(player, enemy) {
    if (player.special === 'secret_power' && enemy.special === 'secret_power') return 'draw';
    if (player.special === 'secret_power') return Math.random() < 0.6 ? 'win' : 'lose';

    if (player.special === 'vs_earth_20' && enemy.element === 'earth') return Math.random() < 0.7 ? 'win' : 'lose';
    if (player.special === 'draw_air' && enemy.element === 'air') return 'draw';
    if (player.special === 'win_vs_earth' && enemy.element === 'earth' && player.id !== enemy.id) return 'win';
    if (player.special === 'win_vs_water' && enemy.element === 'water') return 'win';

    if (player.element === enemy.element) return 'draw';

    const winsAgainst = {
      water: 'fire',
      fire: 'air',
      air: 'earth',
      earth: 'water'
    };

    if (winsAgainst[player.element] === enemy.element) return 'win';
    if (winsAgainst[enemy.element] === player.element) return 'lose';

    return Math.random() < 0.5 ? 'win' : 'lose';
  }

  showResult() {
    const wins = this.roundResults.filter(r => r === 'win').length;
    const resultText = wins >= 2 ? 'Победа!' : 'Поражение';

    this.statusText = this.add.text(this.cameras.main.centerX, this.scale.height - 100, resultText, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const exitBtn = this.add.text(this.cameras.main.centerX, this.scale.height - 50, 'Выйти', {
      fontSize: '24px',
      backgroundColor: '#444',
      color: '#fff',
      padding: 10
    }).setOrigin(0.5).setInteractive();

    exitBtn.on('pointerdown', () => this.scene.start('Home'));
  }
}
