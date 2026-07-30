/**
 * Точка входа и роутинг приложения
 */

const App = {
  selectedLevel: null,

  init() {
    // Telegram WebApp init
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    UI.init();
    UI.showScreen('menu');
    UI.renderMenu();

    // Keyboard handler
    document.getElementById('user-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        App.sendMessage();
      }
    });
  },

  selectLevel(levelId) {
    this.selectedLevel = levelId;
    const level = CONFIG.LEVELS.find(l => l.id === levelId);
    UI.renderProfile(level);
    UI.showScreen('profile');
  },

  startGame() {
    if (!this.selectedLevel) return;
    Game.init(this.selectedLevel);
  },

  backToMenu() {
    Game.goMenu();
  },

  sendMessage() {
    const inp = document.getElementById('user-input');
    const text = inp?.value?.trim();
    if (text) Game.sendUserMessage(text);
  },

  sendQuick(text) {
    Game.sendUserMessage(text);
  },

  rateGood(btn, userMsg, botReply) {
    // Деактивировать кнопки после оценки
    const actions = btn.closest('.msg-actions');
    if (actions) {
      actions.querySelectorAll('.btn-rate').forEach(b => b.disabled = true);
    }
    Game.rateGood(userMsg, botReply);
  },

  rateBad(btn, userMsg, botReply) {
    const actions = btn.closest('.msg-actions');
    if (actions) {
      actions.querySelectorAll('.btn-rate').forEach(b => b.disabled = true);
    }
    Game.rateBad(userMsg, botReply);
  },

  restartLevel() {
    Game.restart();
  },

  goMenu() {
    Game.goMenu();
  },

  exportDataset() {
    Storage.exportAll();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
