/**
 * UI-менеджер Tinder Trainer
 */

const UI = {
  screens: {},

  init() {
    this.screens = {
      menu: document.getElementById('screen-menu'),
      profile: document.getElementById('screen-profile'),
      game: document.getElementById('screen-game'),
      gameover: document.getElementById('screen-gameover'),
      levelcomplete: document.getElementById('screen-levelcomplete'),
    };
  },

  showScreen(name) {
    Object.values(this.screens).forEach(s => s && s.classList.add('hidden'));
    const screen = this.screens[name];
    if (screen) {
      screen.classList.remove('hidden');
      screen.classList.add('screen-enter');
      setTimeout(() => screen.classList.remove('screen-enter'), 400);
    }
  },

  // === МЕНЮ ===
  renderMenu() {
    const progress = Storage.getProgress();
    const stats = Storage.getStats();
    const levelsEl = document.getElementById('levels-grid');
    if (!levelsEl) return;

    const goodCount = Storage.getGoodDataset().length;
    const badCount = Storage.getBadDataset().length;
    document.getElementById('stat-good').textContent = goodCount;
    document.getElementById('stat-bad').textContent = badCount;

    levelsEl.innerHTML = CONFIG.LEVELS.map(l => {
      const completed = progress.completedLevels.includes(l.id);
      const best = progress.highScores[l.id] || 0;
      return `
        <div class="level-card ${completed ? 'completed' : ''}" onclick="App.selectLevel(${l.id})">
          <div class="level-num">Lv.${l.id}</div>
          <div class="level-name">${l.name}</div>
          <div class="level-sub">${l.subtitle}</div>
          ${completed ? `<div class="level-badge">✓ ${best} идеал.</div>` : '<div class="level-badge open">OPEN</div>'}
        </div>`;
    }).join('');
  },

  // === ПРОФИЛЬ ===
  renderProfile(level) {
    document.getElementById('profile-level-num').textContent = level.id;
    document.getElementById('profile-level-name').textContent = level.name;
  },

  // === ИГРОВОЙ ЭКРАН ===
  renderGameScreen(level) {
    document.getElementById('game-level-name').textContent = `LEVEL ${level.id} — ${level.name.toUpperCase()}`;
    document.getElementById('game-level-desc').textContent = level.description;
    document.getElementById('progress-target').textContent = level.targetReplies;
    document.getElementById('progress-current').textContent = '0';
  },

  renderHP(hp) {
    const el = document.getElementById('hp-display');
    if (!el) return;
    let html = '';
    for (let i = 0; i < CONFIG.MAX_HP; i++) {
      html += `<span class="heart ${i < hp ? 'alive' : 'dead'}">♥</span>`;
    }
    el.innerHTML = html;
  },

  clearChat() {
    const chat = document.getElementById('chat-messages');
    if (chat) chat.innerHTML = '';
  },

  appendUserMessage(text) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;
    const div = document.createElement('div');
    div.className = 'msg msg-user animate-in';
    div.innerHTML = `<div class="msg-bubble">${this._escape(text)}</div>`;
    chat.appendChild(div);
    this._scrollChat(chat);
  },

  appendBotMessage(text, userMsg, replyIdx) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;

    // Обновить счётчик реплик
    if (replyIdx !== null && replyIdx !== undefined) {
      document.getElementById('progress-current').textContent = replyIdx;
    }

    const div = document.createElement('div');
    div.className = 'msg msg-bot animate-in';

    const hasRating = userMsg !== null && replyIdx !== null;
    div.innerHTML = `
      <div class="avatar-wrap"><div class="avatar-circle">Н</div></div>
      <div class="msg-content">
        <div class="msg-bubble">${this._escape(text)}</div>
        ${hasRating ? `
        <div class="msg-actions">
          <button class="btn-rate btn-good" onclick="App.rateGood(this, '${this._escAttr(userMsg)}', '${this._escAttr(text)}')">
            👍 Идеал
          </button>
          <button class="btn-rate btn-bad" onclick="App.rateBad(this, '${this._escAttr(userMsg)}', '${this._escAttr(text)}')">
            👎 Косяк −1HP
          </button>
        </div>` : ''}
      </div>`;
    chat.appendChild(div);
    this._scrollChat(chat);
  },

  setLoading(show) {
    const el = document.getElementById('typing-indicator');
    if (el) el.classList.toggle('hidden', !show);
    const btn = document.getElementById('btn-send');
    if (btn) btn.disabled = show;
  },

  clearInput() {
    const inp = document.getElementById('user-input');
    if (inp) { inp.value = ''; inp.focus(); }
  },

  showRatingFeedback(type) {
    const el = document.getElementById('rating-toast');
    if (!el) return;
    el.textContent = type === 'good' ? '✓ Записано в датасет идеала!' : '✗ Косяк записан, −1 HP';
    el.className = `rating-toast ${type} show`;
    setTimeout(() => el.classList.remove('show'), 2000);
  },

  showError(msg) {
    const el = document.getElementById('rating-toast');
    if (!el) return;
    el.textContent = '⚠ ' + msg;
    el.className = 'rating-toast bad show';
    setTimeout(() => el.classList.remove('show'), 4000);
  },

  promptReason() {
    return prompt('В чём ошибка ответа Насти? (можно пропустить)');
  },

  // === GAME OVER ===
  renderGameOver(level) {
    document.getElementById('go-level-name').textContent = `LEVEL ${level.id} — ${level.name}`;
  },

  // === LEVEL COMPLETE ===
  renderLevelComplete(level, state) {
    document.getElementById('lc-level-name').textContent = `LEVEL ${level.id} — ${level.name.toUpperCase()}`;
    document.getElementById('lc-replies').textContent = state.replyCount;
    document.getElementById('lc-good').textContent = state.goodCount;
    document.getElementById('lc-bad').textContent = state.badCount;
    document.getElementById('lc-hp').textContent = state.hp;

    // Показать кнопку "следующий уровень" если есть
    const nextId = level.id + 1;
    const nextLevel = CONFIG.LEVELS.find(l => l.id === nextId);
    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) {
      if (nextLevel) {
        nextBtn.classList.remove('hidden');
        nextBtn.onclick = () => App.selectLevel(nextId);
      } else {
        nextBtn.classList.add('hidden');
      }
    }
  },

  // === HELPERS ===
  _escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');
  },

  _escAttr(str) {
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '&quot;')
      .replace(/\n/g, ' ');
  },

  _scrollChat(chat) {
    setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);
  },
};
