export default class BattlePhaseScene extends Phaser.Scene {
  constructor() {
    super('BattlePhase');
  }

  preload() {
    for (let i = 1; i <= 9; i++) {
      this.load.image(`card_${i}`, `https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_${i}.png`);
    }
  }

  create() {
    this.playerCards = window.selectedCards; // ['card_3', 'card_7', 'card_8']
    this.enemyCards = Phaser.Utils.Array.Shuffle([...Array(9)].map((_, i) => `card_${i + 1}`)).slice(0, 3);

    this.cardTypes = {
      card_1: 'fire',
      card_2: 'water',
      card_3: 'earth',
      card_4: 'air',
      card_5: 'fire',
      card_6: 'water',
      card_7: 'earth',
      card_8: 'air',
      card_9: 'secret'
    };

    this.results = [];
    this.battleLog = [];
    this.round = 0;

    this.runRound();
  }

  runRound() {
    if (this.round >= 3) {
      this.showResult();
      return;
    }

    this.clearScene();

    const playerCard = this.playerCards[this.round];
    const enemyCard = this.enemyCards[this.round];
    const px = this.cameras.main.centerX;
    const py = this.cameras.main.centerY + 100;
    const ey = this.cameras.main.centerY - 100;

    this.add.image(px, py, playerCard).setScale(0.4);
    this.add.image(px, ey, enemyCard).setScale(0.4);

    const result = this.getResult(playerCard, enemyCard);
    this.results.push(result);

    const symbol = { win: '✔', lose: '❌', draw: '=' }[result];
    const pType = this.cardTypes[playerCard];
    const eType = this.cardTypes[enemyCard];

    this.battleLog.push(`Round ${this.round + 1}: ${pType.toUpperCase()} vs ${eType.toUpperCase()} → ${result.toUpperCase()}`);

    this.time.delayedCall(1000, () => {
      const color = { win: 0x00ff00, lose: 0xff0000, draw: 0xaaaaaa }[result];
      this.add.text(px, this.cameras.main.centerY, symbol, {
        fontSize: '36px',
        color: '#ffffff'
      }).setOrigin(0.5);

      this.round++;
      this.time.delayedCall(1300, () => this.runRound());
    });
  }

  getResult(playerId, enemyId) {
    const p = this.cardTypes[playerId];
    const e = this.cardTypes[enemyId];

    // Ничья по типу
    if (p === e) return 'draw';

    // Особые эффекты
    if (playerId === 'card_5' && e === 'earth') return Math.random() < 0.7 ? 'win' : 'lose'; // +20% против земли
    if (playerId === 'card_6' && e === 'air') return 'draw'; // ничья с воздухом
    if (playerId === 'card_7' && e === 'earth') return 'win'; // победа над землей
    if (playerId === 'card_8' && e === 'water') return 'win'; // победа над водой
    if (playerId === 'card_9' && enemyId !== 'card_9') return Math.random() < 0.6 ? 'win' : 'lose'; // секрет

    const beats = {
      fire: 'air',
      water: 'fire',
      earth: 'water',
      air: 'earth'
    };

    if (beats[p] === e) return 'win';
    if (beats[e] === p) return 'lose';

    return Math.random() < 0.5 ? 'win' : 'lose'; // равные, но разные типы
  }

  clearScene() {
    this.children.removeAll();
  }

  showResult() {
    const cx = this.cameras.main.centerX;
    const wins = this.results.filter(r => r === 'win').length;
    const draws = this.results.filter(r => r === 'draw').length;
    const victory = wins >= 2;
    const reward = victory ? 100 : 20;

    window.coins += reward;

    this.add.text(cx, 80, victory ? 'Victory!' : 'Defeat', {
      fontSize: '32px',
      color: victory ? '#00ff00' : '#ff3333'
    }).setOrigin(0.5);

    this.add.text(cx, 130, `You earned ${reward} coins`, {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.battleLog.forEach((line, i) => {
      this.add.text(cx, 180 + i * 26, line, {
        fontSize: '16px',
        color: '#dddddd'
      }).setOrigin(0.5);
    });

    this.add.text(cx, this.scale.height - 80, '← Back to Home', {
      fontSize: '22px',
      backgroundColor: '#444',
      color: '#fff',
      padding: 10
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start('Home');
    });
  }
}
