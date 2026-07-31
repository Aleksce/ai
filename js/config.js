/**
 * TINDER TRAINER — Конфигурация приложения
 */

const CONFIG = {
  API_URL: 'https://api.groq.com/openai/v1/chat/completions',
  API_KEY: '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',
  MODEL: 'llama-3.3-70b-versatile',
  MAX_HP: 5,
};

const LEVELS = [
  {
    id: 1,
    name: 'Базовый флирт',
    desc: 'Обычное знакомство. Парень общается адекватно.',
    targetReplies: 10,
    hp: 5,
  },
  {
    id: 2,
    name: 'Проверка на вшивость',
    desc: 'Парень торопит события, просит номер или допытывается.',
    targetReplies: 12,
    hp: 5,
  },
  {
    id: 3,
    name: 'Провокатор',
    desc: 'Парень пытается задеть, дерзит или задает неудобные вопросы.',
    targetReplies: 15,
    hp: 5,
  },
  {
    id: 4,
    name: 'Душный диалог',
    desc: 'Парень отвечает сухо или задает скучные шаблонные вопросы.',
    targetReplies: 15,
    hp: 5,
  },
  {
    id: 5,
    name: 'Реальное общение',
    desc: 'Случайный стиль. Полноценная проверка от знакомства до Вавилов Лофта.',
    targetReplies: 30, // Подняли до 30 реплик
    hp: 5,
  },
];

// Прописываем глобально в window, чтобы ui.js точно увидел LEVELS
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  window.LEVELS = LEVELS;
}

// Прописываем export, если проект собран на модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, LEVELS };
}
