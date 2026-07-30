/**
 * Игровая логика Tinder Trainer
 */

const Game = {
  state: {
    currentLevel: null,
    hp: CONFIG.MAX_HP,
    history: [], // [{role, content}]
    replyCount: 0,
    goodCount: 0,
    badCount: 0,
    isLoading: false,
    lastBotMsg: null,
    lastUserMsg: null,
    sessionStarted: false,
  },

  init(levelId) {
    const level = CONFIG.LEVELS.find(l => l.id === levelId);
    if (!level) return;

    this.state = {
      currentLevel: level,
      hp: CONFIG.MAX_HP,
      history: [],
      replyCount: 0,
      goodCount: 0,
      badCount: 0,
      isLoading: false,
      lastBotMsg: null,
      lastUserMsg: null,
      sessionStarted: true,
    };

    Storage.incrementStat('totalGames');
    UI.showScreen('game');
    UI.renderGameScreen(level);
    UI.renderHP(this.state.hp);
    UI.clearChat();

    // Приветственное сообщение от Насти для уровня 1
    if (levelId === 1) {
      setTimeout(() => this.sendNastyaFirst(), 600);
    }
  },

  async sendNastyaFirst() {
    const greetings = [
      'привет) ты первый написал, интересно',
      'привет! как ты?',
      'привет, наконец-то кто-то интересный написал ахах',
    ];
    const msg = greetings[Math.floor(Math.random() * greetings.length)];
    UI.appendBotMessage(msg, null, null); // first msg - no rating needed
  },

  async sendUserMessage(text) {
    if (this.state.isLoading || !text.trim()) return;
    if (!this.state.sessionStarted) return;

    this.state.isLoading = true;
    this.state.lastUserMsg = text;

    UI.appendUserMessage(text);
    UI.setLoading(true);
    UI.clearInput();

    this.state.history.push({ role: 'user', content: text });

    try {
      const systemPrompt = getSystemPrompt(this.state.currentLevel.id);
      const botReply = await AI.sendMessage(this.state.history, systemPrompt);

      this.state.lastBotMsg = botReply;
      this.state.history.push({ role: 'assistant', content: botReply });
      this.state.replyCount++;

      UI.setLoading(false);
      UI.appendBotMessage(botReply, this.state.lastUserMsg, this.state.replyCount);

      // Проверка на завершение уровня
      const target = this.state.currentLevel.targetReplies;
      if (this.state.replyCount >= target && this.state.hp > 0) {
        setTimeout(() => this.levelComplete(), 1200);
      }
    } catch (err) {
      UI.setLoading(false);
      UI.showError('Ошибка AI: ' + err.message);
      this.state.history.pop(); // откатить незавершённый user msg
    }

    this.state.isLoading = false;
  },

  rateGood(userMsg, botReply) {
    Storage.addGood({
      level: this.state.currentLevel.id,
      userMsg,
      botReply,
      history: this.state.history,
    });
    this.state.goodCount++;
    Storage.incrementStat('totalGood');
    UI.showRatingFeedback('good');
  },

  rateBad(userMsg, botReply) {
    const reason = UI.promptReason();
    if (reason === null) return; // отменил

    Storage.addBad({
      level: this.state.currentLevel.id,
      userMsg,
      botReply,
      reason: reason || 'не указана',
      history: this.state.history,
    });

    this.state.badCount++;
    this.state.hp = Math.max(0, this.state.hp - 1);
    Storage.incrementStat('totalBad');
    UI.renderHP(this.state.hp);
    UI.showRatingFeedback('bad');

    if (this.state.hp <= 0) {
      setTimeout(() => this.gameOver(), 700);
    }
  },

  gameOver() {
    Storage.incrementStat('totalGameOvers');
    UI.showScreen('gameover');
    UI.renderGameOver(this.state.currentLevel);
  },

  levelComplete() {
    const score = this.state.goodCount;
    Storage.completeLevel(this.state.currentLevel.id, score);
    UI.showScreen('levelcomplete');
    UI.renderLevelComplete(this.state.currentLevel, this.state);
  },

  restart() {
    if (this.state.currentLevel) {
      this.init(this.state.currentLevel.id);
    }
  },

  goMenu() {
    this.state.sessionStarted = false;
    UI.showScreen('menu');
    UI.renderMenu();
  },
};
