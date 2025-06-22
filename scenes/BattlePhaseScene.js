export default class BattlePhaseScene extends Phaser.Scene {
  constructor() {
    super('BattlePhase');
  }

  preload() {
    // Загружаем карты
    for (let i = 1; i <= 9; i++) {
      this.load.image(`card_${i}`, `https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/card_${i}.png`);
    }
    // Загружаем фон из GitHub
    this.load.image('battleBg', 'https://raw.githubusercontent.com/LevaMakeGames/space-dino/main/assets/battleBg.png');
  }

  create() {
    if (!window.selectedCards || window.selectedCards.length !== 3) {
      this.scene.start('Home');
      return;
    }

    // Фон
    const bg = this.add.image(0, 0, 'battleBg').setOrigin(0);
    const scaleX = this.scale.width / bg.width;
    const scaleY = this.scale.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setDepth(0);

    // Карты бота и игрока
    this.enemyCards = this.getRandomEnemyCards();
    this.playerCardImages = [];
    this.enemyCardImages = [];

    this.showCards();

    this.round = 0;
    this.playerWins = 0;
    this.enemyWins = 0;

    this.time.delayedCall(1000, () => this.runNextRound());
  }

  showCards() {
    const spacing = 120;
    const centerX = this.cameras.main.centerX;
    const topY = 100;
    const bottomY = this.cameras.main.height - 100;

    for (let i = 0; i < 3; i++) {
      const px = centerX - spacing + i * spacing;

      const player = window.selectedCards[i];
      const enemy = this.enemyCards[i];

      const playerImg = this.add.image(px, bottomY, `card_${player.id}`).setScale(0.52);
      const enemyImg = this.add.image(px, topY, `card_${enemy.id}`).setScale(0.52);

      this.playerCardImages.push(playerImg);
      this.enemyCardImages.push(enemyImg);
    }
  }

  runNextRound() {
    if (this.round >= 3) {
      this.showFinalResult();
      return;
    }

    const player = window.selectedCards[this.round];
    const enemy = this.enemyCards[this.round];
    const playerImg = this.playerCardImages[this.round];
    const enemyImg = this.enemyCardImages[this.round];

    const outcome = this.determineWinner(player, enemy);

    // ✅ 1) Оба двигаются вперёд
    this.tweens.add({ targets: playerImg, y: playerImg.y - 50, duration: 300 });
    this.tweens.add({ targets: enemyImg, y: enemyImg.y + 50, duration: 300 });

    this.time.delayedCall(400, () => {
      // ✅ 2) Победитель делает "удар", проигравший уменьшается
      if (outcome === 'player') {
        this.playerWins++;
        this.tweens.add({ targets: playerImg, scale: 0.62, duration: 200, yoyo: true });
        this.tweens.add({ targets: enemyImg, scale: 0.42, angle: 10, duration: 200 });
      } else {
        this.enemyWins++;
        this.tweens.add({ targets: enemyImg, scale: 0.62, duration: 200, yoyo: true });
        this.tweens.add({ targets: playerImg, scale: 0.42, angle: -10, duration: 200 });
      }
    });

    this.time.delayedCall(1000, () => {
      // ✅ 3) Убираем карты, ставим эмодзи
      playerImg.destroy();
      enemyImg.destroy();

      const px = playerImg.x;
      const topY = enemyImg.y;
      const bottomY = playerImg.y;

      const playerEmoji = outcome === 'player' ? '✅' : '❌';
      const enemyEmoji = outcome === 'player' ? '❌' : '✅';

      this.add.text(px, topY, enemyEmoji, { fontSize: '40px' }).setOrigin(0.5);
      this.add.text(px, bottomY, playerEmoji, { fontSize: '40px' }).setOrigin(0.5);

      this.round++;
      this.time.delayedCall(1000, () => this.runNextRound());
    });
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

    return Math.random() < 0.5 ? 'player' : 'enemy';
  }

  showFinalResult() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    let resultEmoji = '';
    let resultText = '';
    let coinReward = 0;
    let gemReward = 0;
    let color = '#ffffff';

    if (this.playerWins > this.enemyWins) {
      resultEmoji = '🏆';
      resultText = 'Victory!';
      coinReward = 100;
      gemReward = 3;
      color = '#00ff00';
    } else {
      resultEmoji = '💀';
      resultText = 'Defeat';
      color = '#ff4444';
    }

    window.coins += coinReward;
    window.gems += gemReward;

    this.add.text(centerX, centerY - 100, 'Battle Over', {
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 30, resultEmoji, {
      fontSize: '80px'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 40, resultText, {
      fontSize: '28px',
      color: color
    }).setOrigin(0.5);

    const rewardLine = `+${coinReward} 💰   +${gemReward} 💎`;
    this.add.text(centerX, centerY + 80, rewardLine, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      this.scene.start('Home');
    });
  }

  getRandomEnemyCards() {
    const allIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const playerIds = window.selectedCards.map(c => c.id);
    const available = allIds.filter(id => !playerIds.includes(id));

    const enemyCards = [];
    for (let i = 0; i < 3; i++) {
      const id = Phaser.Utils.Array.RemoveRandomElement(available);
      enemyCards.push(this.getCardData(id));
    }
    return enemyCards;
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
}
