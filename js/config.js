/**
 * =====================================================
 * TINDER TRAINER: NASTYA EDITION — Конфигурация API
 * =====================================================
 *
 * Выбери провайдера AI и вставь ключ ниже.
 *
 * ВАРИАНТ 1 — Groq (бесплатно, быстро, без блокировок Google):
 *    Получи ключ на: https://console.groq.com/keys
 *    Установи: AI_PROVIDER = 'groq'
 *              GROQ_API_KEY = 'gsk_...'
 *
 * ВАРИАНТ 2 — Gemini (бесплатно, онлайн):
 *    Установи: AI_PROVIDER = 'gemini'
 *
 * ВАРИАНТ 3 — Ollama (локально, бесплатно):
 *    Установи: AI_PROVIDER = 'ollama'
 */

const CONFIG = {
  // === ВЫБЕРИ ПРОВАЙДЕРА: 'groq', 'gemini' или 'ollama' ===
  AI_PROVIDER: 'groq',

  // === GROQ (Быстро и бесплатно) ===
  GROQ_API_KEY: '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',
  GROQ_MODEL: 'llama-3.3-70b-versatile',

  // === GEMINI ===
  GEMINI_API_KEY: '',
  GEMINI_MODEL: 'gemini-3.1-flash-lite',

  // === OLLAMA (локально) ===
  OLLAMA_BASE_URL: 'http://localhost:11434',
  OLLAMA_MODEL: 'llama3',

  // === ИГРОВЫЕ НАСТРОЙКИ ===
  MAX_HP: 5,
  LEVELS: [
    {
      id: 1,
      name: 'Знакомство',
      subtitle: 'Первое впечатление',
      description: 'Задача: продержаться 5 реплик, не сливая личную информацию, и расположить к себе.',
      targetReplies: 5,
      locked: false,
    },
    {
      id: 2,
      name: 'Границы',
      subtitle: 'Проверка на доступность',
      description: 'Админ начнёт давить: просить номер, ватсап, звать домой. Настя должна устоять.',
      targetReplies: 6,
      locked: false,
    },
    {
      id: 3,
      name: 'Встреча',
      subtitle: 'Вывод на встречу',
      description: 'Цель: отвергнуть банальные предложения и мягко перевести на МК в Вавилов Лофте.',
      targetReplies: 7,
      locked: false,
    },
    {
      id: 4,
      name: 'Хардкор',
      subtitle: 'Токсичный клиент',
      description: 'Максимально трудный собеседник с подвохами, обвинениями и провокациями.',
      targetReplies: 8,
      locked: false,
    },
    {
      id: 5,
      name: 'Реальное общение',
      subtitle: 'Свободный режим',
      description: 'Без ограничений и сценария. Полноценный живой диалог. Цель та же — встреча.',
      targetReplies: 12,
      locked: false,
    },
  ],
};
