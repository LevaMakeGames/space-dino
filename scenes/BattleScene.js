export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  create() {
    this.availableCards = ['fire', 'water', 'earth', 'air'];
    this.selectedCards = [];
    this.enemyCards = [];
    this.roundResults = [];
    this.currentRound = 0;

    this.createCardSelection();
  }

  createCardSelection() {
    const spacing = 140;
    const startX = this.cameras.main.centerX - (this.availableCards.length - 1) * spacing / 2;
    const y = 150;

    this.cardButtons = [];

    this.availableCards.forEach((element, i) => {
      const x = startX + i * spacing;
      const rect = this.add.rectangle(x, y, 100, 140, 0x444444).setStrokeStyle(2, 0xffffff).setInteractive();
      const label = this.add.text(x, y, element.toUpperCase(), {
        fontSize: '20px',
        color: '#ffffff'
      }).setOrigin(0.5);

      rect.on('pointerdown', () => this.selectCard(element, rect));

      this.cardButtons.push({ element, rect });
    });

    this.statusText = this.add.text(this.cameras.main.centerX, 300, 'Выберите 3 карты', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  selectCard(element, rect) {
    if (this.selectedCards.length >= 3 || this.selectedCards.includes(element)) return;

    rect.setFillStyle(0x00aa00);
    this.selectedCards.push(element);

    if (this.selectedCards.length === 3) {
      this.statusText.setText('Бой начинается...');
      this.time.delayedCall(1000, () => this.startBattle());
    }
  }

  startBattle() {
    // Подбираем вражеские карты (2 слабых, 1 сильная)
    const getWeak = el => ({
      fire: 'earth',
      water: 'fire',
      earth: 'water',
      air: 'air'
    })[el];

    const getStrong = el => ({
      fire: 'water',
      water: 'earth',
      earth: 'fire',
      air: 'air'
    })[el];

    this.enemyCards = [
      getWeak(this.selectedCards[0]),
      getWeak(this.selectedCards[1]),
      getStrong(this.selectedCards[2])
    ];

    this.clearScene();
    this.runRound(0);
    this.time.delayedCall(2000, () => this.runRound(1));
    this.time.delayedCall(4000, () => this.runRound(2));
    this.time.delayedCall(6000, () => this.showResult());
  }

  clearScene() {
    this.cardButtons.forEach(btn => {
      btn.rect.destroy();
    });
    this.statusText.setText('');
  }

  runRound(index) {
    const player = this.selectedCards[index];
    const enemy = this.enemyCards[index];

    const centerX = this.cameras.main.centerX;
    const spacing = 160;
    const startX = centerX - spacing;

    const x = startX + index * spacing;
    const yPlayer = this.cameras.main.centerY + 100;
    const yEnemy = this.cameras.main.centerY - 100;

    const rectPlayer = this.add.rectangle(x, yPlayer, 100, 140, 0x222222).setStrokeStyle(2, 0xffffff);
    const labelPlayer = this.add.text(x, yPlayer, player.toUpperCase(), { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

    const rectEnemy = this.add.rectangle(x, yEnemy, 100, 140, 0x444444).setStrokeStyle(2, 0xffffff);
    const labelEnemy = this.add.text(x, yEnemy, enemy.toUpperCase(), { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

    const result = this.getResult(player, enemy);
    this.roundResults.push(result);

    const symbol = {
      win: '✔',
      lose: '❌',
      draw: '='
    }[result];

    this.time.delayedCall(1000, () => {
      const color = {
        win: 0x00ff00,
        lose: 0xff0000,
        draw: 0xaaaaaa
      }[result];

      rectPlayer.setStrokeStyle(4, color);
      rectEnemy.setStrokeStyle(4, color);

      this.add.text(x, this.cameras.main.centerY, symbol, {
        fontSize: '32px',
        color: '#ffffff'
      }).setOrigin(0.5);
    });
  }

  getResult(player, enemy) {
    if (player === enemy) return 'draw';
    if (
      (player === 'fire' && enemy === 'earth') ||
      (player === 'earth' && enemy === 'water') ||
      (player === 'water' && enemy === 'fire')
    ) return 'win';
    return 'lose';
  }

  showResult() {
    const wins = this.roundResults.filter(r => r === 'win').length;
    const text = wins >= 2 ? 'Победа!' : 'Поражение';

    this.statusText.setText(text);

    const btn = this.add.text(this.cameras.main.centerX, this.scale.height - 80, 'Выйти', {
      fontSize: '24px',
      backgroundColor: '#555',
      color: '#fff',
      padding: 10
    }).setOrigin(0.5).setInteractive().setDepth(2);

    btn.on('pointerdown', () => this.scene.start('Home'));
  }
}
