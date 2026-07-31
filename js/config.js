/**
 * TINDER TRAINER — Конфигурация приложения
 */

window.CONFIG = {
  API_URL: 'https://api.groq.com/openai/v1/chat/completions',
  API_KEY: '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',
  MODEL: 'llama-3.3-70b-versatile',
  MAX_HP: 5,
};

window.LEVELS = [
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
    targetReplies: 30, // Увеличено до 30 сообщений
    hp: 5,
  },
];

// Для совместимости, если где-то используется const
const CONFIG = window.CONFIG;
const LEVELS = window.LEVELS;
