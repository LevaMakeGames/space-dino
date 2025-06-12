export default class BattlePhaseScene extends Phaser.Scene {
  constructor() {
    super('BattlePhase');
  }

  preload() {
    this.load.image('card_fire', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_fire.png');
    // Добавь остальные 9 карт, если нужно
  }

  create() {
    this.playerCards = window.selectedCards;
    this.enemyCards = this.generateEnemyCards();

    this.round = 0;
    this.results = [];
    this.battleLog = [];

    this.startNextRound();
  }

  generateEnemyCards() {
    const all = ['fire', 'water', 'earth', 'air', 'card_5', 'card_6', 'card_7', 'card_8', 'card_9'];
    const shuffled = Phaser.Utils.Array.Shuffle(all);
    return shuffled.slice(0, 3);
  }

  startNextRound() {
    if (this.round >= 3) {
      this.showBattleResult();
      return;
    }

    this.clearScene();

    const player = this.playerCards[this.round];
    const enemy = this.enemyCards[this.round];

    const x = this.cameras.main.centerX;
    const yPlayer = this.cameras.main.centerY + 80;
    const yEnemy = this.cameras.main.centerY - 80;

    this.add.image(x, yPlayer, 'card_fire').setScale(0.4); // Замени на соответствующий key
    this.add.image(x, yEnemy, 'card_fire').setScale(0.4); // Замени на соответствующий key

    const result = this.getResult(player, enemy);
    this.results.push(result);

    const symbol = {
      win: '✔',
      lose: '❌',
      draw: '='
    }[result];

    this.battleLog.push(`Round ${this.round + 1}: ${player.toUpperCase()} vs ${enemy.toUpperCase()} → ${result.toUpperCase()}`);

    this.time.delayedCall(1000, () => {
      this.add.text(x, this.cameras.main.centerY, symbol, {
        fontSize: '40px',
        color: '#ffffff'
      }).setOrigin(0.5);

      this.round++;
      this.time.delayedCall(1200, () => this.startNextRound());
    });
  }

  getResult(p, e) {
    if (p === e) return 'draw';

    const winMap = {
      fire: 'air',
      water: 'fire',
      earth: 'water',
      air: 'earth'
    };

    // Спец-карты
    if (p === 'card_5' && e === 'earth') return Math.random() < 0.7 ? 'win' : 'lose';
    if (p === 'card_6' && e === 'air') return 'draw';
    if (p === 'card_7' && e === 'earth') return 'win';
    if (p === 'card_8' && e === 'water') return 'win';
    if (p === 'card_9' && e !== 'card_9') return Math.random() < 0.6 ? 'win' : 'lose';

    // Обычные победы
    if (winMap[p] === e) return 'win';
    if (winMap[e] === p) return 'lose';

    return Math.random() < 0.5 ? 'win' : 'lose';
  }

  clearScene() {
    this.children.removeAll();
  }

  showBattleResult() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const wins = this.results.filter(r => r === 'win').length;
    const draws = this.results.filter(r => r === 'draw').length;

    const resultText = wins >= 2 ? 'Victory!' : (wins === 1 && draws === 2 ? 'Draw' : 'Defeat');
    const reward = wins >= 2 ? 100 : 20;

    window.coins += reward;

    this.add.text(centerX, 100, resultText, {
      fontSize: '32px',
      color: '#00ff00'
    }).setOrigin(0.5);

    this.add.text(centerX, 150, `You earned ${reward} coins`, {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Лог
    this.battleLog.forEach((line, i) => {
      this.add.text(centerX, 200 + i * 24, line, {
        fontSize: '16px',
        color: '#dddddd'
      }).setOrigin(0.5);
    });

    // Кнопка назад
    const btn = this.add.text(centerX, this.scale.height - 80, 'Back to Home', {
      fontSize: '24px',
      backgroundColor: '#444',
      color: '#fff',
      padding: 10
    }).setOrigin(0.5).setInteractive();

    btn.on('pointerdown', () => {
      this.scene.start('Home');
    });
  }
}
