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
    if (!window.selectedCards || window.selectedCards.length !== 3) {
      this.scene.start('Home');
      return;
    }

    this.enemyCards = this.getRandomEnemyCards();

    this.add.text(this.cameras.main.centerX, 20, 'Battle Phase', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.showEnemyCards();
    this.showPlayerCards();

    this.time.delayedCall(1000, () => {
      this.startBattleRounds();
    });
  }

  showPlayerCards() {
    const spacing = 120;
    const centerX = this.cameras.main.centerX;
    const y = this.cameras.main.height - 100;

    window.selectedCards.forEach((card, i) => {
      const x = centerX - spacing + i * spacing;
      this.add.image(x, y, `card_${card.id}`).setScale(0.4);
    });
  }

  showEnemyCards() {
    const spacing = 120;
    const centerX = this.cameras.main.centerX;
    const y = 100;

    this.enemyCards.forEach((card, i) => {
      const x = centerX - spacing + i * spacing;
      this.add.image(x, y, `card_${card.id}`).setScale(0.4);
    });
  }

  getRandomEnemyCards() {
    const allIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const playerIds = window.selectedCards.map(c => c.id);
    const available = allIds.filter(id => !playerIds.includes(id));

    Phaser.Utils.Array.Shuffle(available);

    return available.slice(0, 3).map(id => {
      return {
        id,
        ...this.getCardData(id)
      };
    });
  }

  getCardData(id) {
    const cardInfo = [
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
    return cardInfo.find(c => c.id === id);
  }

  startBattleRounds() {
    this.round = 0;
    this.playerWins = 0;
    this.enemyWins = 0;

    this.roundText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '', {
      fontSize: '28px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.runNextRound();
  }

  runNextRound() {
    if (this.round >= 3) {
      this.showFinalResult();
      return;
    }

    const player = window.selectedCards[this.round];
    const enemy = this.enemyCards[this.round];

    let resultText = `Round ${this.round + 1}:\n${player.name} vs ${enemy.name}`;

    const outcome = this.determineWinner(player, enemy);
    if (outcome === 'player') {
      this.playerWins++;
      resultText += '\n✅ You win this round!';
    } else if (outcome === 'enemy') {
      this.enemyWins++;
      resultText += '\n❌ Enemy wins this round!';
    } else {
      resultText += '\n🤝 Draw!';
    }

    this.roundText.setText(resultText);
    this.round++;

    this.time.delayedCall(2000, () => this.runNextRound());
  }

  determineWinner(player, enemy) {
    const beats = {
      fire: 'earth',
      water: 'fire',
      earth: 'air',
      air: 'water'
    };

    if (beats[player.element] === enemy.element) return 'player';
    if (beats[enemy.element] === player.element) return 'enemy';
    return 'draw';
  }

  showFinalResult() {
    let text = `🏁 Battle Over!\nYou: ${this.playerWins} | Enemy: ${this.enemyWins}\n`;

    if (this.playerWins > this.enemyWins) {
      text += '🎉 Victory!';
      window.coins += 100;
    } else if (this.enemyWins > this.playerWins) {
      text += '💀 Defeat!';
    } else {
      text += '⚖️ It\'s a draw!';
      window.coins += 30;
    }

    this.roundText.setText(text + '\n\nReturning to menu...');

    this.time.delayedCall(3000, () => {
      this.scene.start('Home');
    });
  }
}
