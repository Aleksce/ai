/**
 * Локальное хранилище датасетов и прогресса
 * Данные хранятся в localStorage браузера.
 * Можно экспортировать в JSON-файл.
 */

const Storage = {
  KEYS: {
    GOOD: 'tt_dataset_good',
    BAD: 'tt_dataset_bad',
    PROGRESS: 'tt_progress',
    STATS: 'tt_stats',
  },

  _load(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  _loadObj(key, def = {}) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(def));
    } catch {
      return def;
    }
  },

  _save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // === Датасеты ===
  addGood({ level, userMsg, botReply, history }) {
    const dataset = this._load(this.KEYS.GOOD);
    dataset.push({
      timestamp: new Date().toISOString(),
      level,
      prompt: userMsg,
      response: botReply,
      context: history.slice(-6),
    });
    this._save(this.KEYS.GOOD, dataset);
  },

  addBad({ level, userMsg, botReply, reason, history }) {
    const dataset = this._load(this.KEYS.BAD);
    dataset.push({
      timestamp: new Date().toISOString(),
      level,
      prompt: userMsg,
      response: botReply,
      reason,
      context: history.slice(-6),
    });
    this._save(this.KEYS.BAD, dataset);
  },

  getGoodDataset() {
    return this._load(this.KEYS.GOOD);
  },

  getBadDataset() {
    return this._load(this.KEYS.BAD);
  },

  // === Прогресс ===
  getProgress() {
    return this._loadObj(this.KEYS.PROGRESS, {
      completedLevels: [],
      highScores: {},
    });
  },

  completeLevel(levelId, score) {
    const p = this.getProgress();
    if (!p.completedLevels.includes(levelId)) {
      p.completedLevels.push(levelId);
    }
    if (!p.highScores[levelId] || score > p.highScores[levelId]) {
      p.highScores[levelId] = score;
    }
    this._save(this.KEYS.PROGRESS, p);
  },

  isLevelCompleted(levelId) {
    return this.getProgress().completedLevels.includes(levelId);
  },

  // === Статистика ===
  getStats() {
    return this._loadObj(this.KEYS.STATS, {
      totalGames: 0,
      totalGood: 0,
      totalBad: 0,
      totalGameOvers: 0,
    });
  },

  incrementStat(key) {
    const s = this.getStats();
    s[key] = (s[key] || 0) + 1;
    this._save(this.KEYS.STATS, s);
  },

  // === Экспорт ===
  exportDataset(type = 'good') {
    const data = type === 'good' ? this.getGoodDataset() : this.getBadDataset();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset_${type}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportAll() {
    const all = {
      good: this.getGoodDataset(),
      bad: this.getBadDataset(),
      stats: this.getStats(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinder_trainer_dataset_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  clearAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
  },
};
