/**
 * TINDER TRAINER — Конфигурация приложения
 */

window.CONFIG = {
  AI_PROVIDER: 'groq',
  GROQ_API_KEY: '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',
  GROQ_MODEL: 'llama-3.3-70b-versatile',
  MAX_HP: 5,

  LEVELS: [
    {
      id: 1,
      name: 'Базовый флирт',
      desc: 'Обычное знакомство. Парень общается адекватно.',
      subtitle: 'Обычное знакомство',
      targetReplies: 10,
      hp: 5,
    },
    {
      id: 2,
      name: 'Проверка на вшивость',
      desc: 'Парень торопит события, просит номер или допытывается.',
      subtitle: 'Мягко удерживаем границы',
      targetReplies: 12,
      hp: 5,
    },
    {
      id: 3,
      name: 'Провокатор',
      desc: 'Парень пытается задеть, дерзит или задает неудобные вопросы.',
      subtitle: 'Держим лицо',
      targetReplies: 15,
      hp: 5,
    },
    {
      id: 4,
      name: 'Душный диалог',
      desc: 'Парень отвечает сухо или задает скучные шаблонные вопросы.',
      subtitle: 'Выводим из скуки',
      targetReplies: 15,
      hp: 5,
    },
    {
      id: 5,
      name: 'Реальное общение',
      desc: 'Случайный стиль. Полноценная проверка от знакомства до Вавилов Лофта.',
      subtitle: 'Знакомство -> МК в Вавилов Лофт',
      targetReplies: 30,
      hp: 5,
    },
  ]
};

var CONFIG = window.CONFIG;
var LEVELS = window.CONFIG.LEVELS;
