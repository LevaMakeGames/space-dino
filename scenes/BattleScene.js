export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  preload() {
    for (let i = 1; i <= 9; i++) {
      this.load.image(`card_${i}`, `assets/cards/card_${i}.png`);
    }
    this.load.image('bg', 'assets/bg_battle.png');
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.playerCards = window.selectedCards || [];
    this.enemyCards = this.generateEnemyCards();
    this.currentRound = 0;
    this.battleLog = [];

    this.displayCards();
    this.time.delayedCall(1000, () => this.startNextRound());
  }

  generateEnemyCards() {
    const allIds = Array.from({ length: 9 }, (_, i) => `card_${i + 1}`);
    const shuffled = Phaser.Utils.Array.Shuffle(allIds);
    return shuffled.filter(id => !this.playerCards.includes(id)).slice(0, 3);
  }

  displayCards() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.playerSprites = [];
    this.enemySprites = [];

    for (let i = 0; i < 3; i++) {
      const pCard = this.add.image(centerX - 200 + i * 200, centerY + 100, this.playerCards[i]).setScale(0.4);
      const eCard = this.add.image(centerX - 200 + i * 200, centerY - 100, this.enemyCards[i]).setScale(0.4);
      this.playerSprites.push(pCard);
      this.enemySprites.push(eCard);
    }
  }

  startNextRound() {
    if (this.currentRound >= 3) {
      return this.showBattleResult();
    }

    const round = this.currentRound;
    const pCard = this.playerCards[round];
    const eCard = this.enemyCards[round];

    const result = this.fight(pCard, eCard);
    this.battleLog.push(`Round ${round + 1}: ${pCard} vs ${eCard} → ${result}`);

    this.animateRound(round, result);

    this.currentRound++;
    this.time.delayedCall(2000, () => this.startNextRound());
  }

  fight(playerCardId, enemyCardId) {
    // Примитивная логика: ID больше — победа
    const pNum = parseInt(playerCardId.split('_')[1]);
    const eNum = parseInt(enemyCardId.split('_')[1]);

    if (pNum > eNum) return 'Player Wins';
    if (pNum < eNum) return 'Enemy Wins';
    return 'Draw';
  }

  animateRound(round, result) {
    const pSprite = this.playerSprites[round];
    const eSprite = this.enemySprites[round];

    this.tweens.add({
      targets: [pSprite, eSprite],
      y: '+=10',
      yoyo: true,
      repeat: 5,
      duration: 100
    });

    const color = result === 'Player Wins' ? 0x00ff00 : result === 'Enemy Wins' ? 0xff0000 : 0xffff00;
    this.time.delayedCall(1000, () => {
      this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, result, {
        fontSize: '24px',
        color: `#${color.toString(16)}`
      }).setOrigin(0.5).setDepth(10);
    });
  }

  showBattleResult() {
    const wins = this.battleLog.filter(log => log.includes('Player Wins')).length;
    const losses = this.battleLog.filter(log => log.includes('Enemy Wins')).length;

    let finalText = 'Draw!';
    if (wins > losses) {
      finalText = 'Victory!';
      window.coins += 100; // Награда
    } else if (losses > wins) {
      finalText = 'Defeat!';
    }

    this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 300, 200, 0x000000, 0.8);
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 60, finalText, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    for (let i = 0; i < this.battleLog.length; i++) {
      this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20 + i * 20, this.battleLog[i], {
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0.5);
    }

    this.time.delayedCall(4000, () => this.scene.start('Home'));
  }
}
