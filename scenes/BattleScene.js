export default class BattlePhaseScene extends Phaser.Scene {
  constructor() {
    super('BattlePhase');
  }

  preload() {
    const cards = ['card_0', 'card_1', 'card_2', 'card_3', 'card_4', 'card_5', 'card_6', 'card_7', 'card_8'];
    cards.forEach(card => {
      this.load.image(card, `https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/${card}.png`);
    });
  }

  create() {
    this.cardNames = {
      card_0: 'fire',
      card_1: 'water',
      card_2: 'earth',
      card_3: 'air',
      card_4: 'air',      // простой воздух
      card_5: 'fire',     // с эффектом против земли
      card_6: 'water',    // ничья с воздухом
      card_7: 'earth',    // авто win против земли
      card_8: 'air'       // авто win против воды
    };

    this.playerCards = window.selectedCards; // ['card_2', 'card_5', 'card_8'] и т.п.
    this.enemyCards = this.generateEnemyCards();

    this.round = 0;
    this.results = [];
    this.battleLog = [];

    this.startNextRound();
  }

  generateEnemyCards() {
    const all = ['card_0', 'card_1', 'card_2', 'card_3', 'card_4', 'card_5', 'card_6', 'card_7', 'card_8'];
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

    this.add.image(x, yPlayer, player).setScale(0.4);
    this.add.image(x, yEnemy, enemy).setScale(0.4);

    const result = this.getResult(player, enemy);
    this.results.push(result);

    const symbol = {
      win: '✔',
      lose: '❌',
      draw: '='
    }[result];

    const playerName = this.cardNames[player] ?? player;
    const enemyName = this.cardNames[enemy] ?? enemy;

    this.battleLog.push(`Round ${this.round + 1}: ${playerName.toUpperCase()} vs ${enemyName.toUpperCase()} → ${result.toUpperCase()}`);

    this.time.delayedCall(1000, () => {
      this.add.text(x, this.cameras.main.centerY, symbol, {
        fontSize: '40px',
        color: '#ffffff'
      }).setOrigin(0.5);

      this.round++;
      this.time.delayedCall(1200, () => this.startNextRound());
    });
  }

  getResult(playerId, enemyId) {
    const p = this.cardNames[playerId];
    const e = this.cardNames[enemyId];

    if (p === e) return 'draw';

    const winMap = {
      fire: 'air',
      water: 'fire',
      earth: 'water',
      air: 'earth'
    };

    // Спец-эффекты
    if (playerId === 'card_5' && e === 'earth') return Math.random() < 0.7 ? 'win' : 'lose';
    if (playerId === 'card_6' && e === 'air') return 'draw';
    if (playerId === 'card_7' && e === 'earth') return 'win';
    if (playerId === 'card_8' && e === 'water') return 'win';
    if (playerId === 'card_9' && enemyId !== 'card_9') return Math.random() < 0.6 ? 'win' : 'lose';

    if (winMap[p] === e) return 'win';
    if (winMap[e] === p) return 'lose';

    return Math.random() < 0.5 ? 'win' : 'lose';
  }

  clearScene() {
    this.children.removeAll();
  }

  showBattleResult() {
    const centerX = this.cameras.main.centerX;

    const wins = this.results.filter(r => r === 'win').length;
    const draws = this.results.filter(r => r === 'draw').length;

    const resultText = wins >= 2 ? 'Victory!' : (wins === 1 && draws === 2 ? 'Draw' : 'Defeat');
    const reward = wins >= 2 ? 100 : 20;

    window.coins += reward;

    this.add.text(centerX, 80, resultText, {
      fontSize: '32px',
      color: '#00ff00'
    }).setOrigin(0.5);

    this.add.text(centerX, 130, `You earned ${reward} coins`, {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.battleLog.forEach((line, i) => {
      this.add.text(centerX, 180 + i * 24, line, {
        fontSize: '16px',
        color: '#dddddd'
      }).setOrigin(0.5);
    });

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
