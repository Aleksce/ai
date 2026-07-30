/**
 * =====================================================
 * TINDER TRAINER: NASTYA EDITION — Конфигурация API
 * =====================================================
 *
 * Выбери провайдера AI и вставь ключ ниже.
 *
 * ВАРИАНТ 1 — Gemini (бесплатно, онлайн):
 *   Получи ключ на: https://aistudio.google.com/app/apikey
 *   Установи: AI_PROVIDER = 'gemini'
 *              GEMINI_API_KEY = 'твой_ключ_здесь'
 *
 * ВАРИАНТ 2 — Ollama (локально, бесплатно):
 *   Установи Ollama: https://ollama.com
 *   Запусти: ollama run llama3
 *   Установи: AI_PROVIDER = 'ollama'
 *              OLLAMA_MODEL = 'llama3' (или другую модель)
 *   Важно: при открытии через Telegram нужен ngrok/туннель к localhost:11434
 */

const CONFIG = {
  // === ВЫБЕРИ ПРОВАЙДЕРА: 'gemini' или 'ollama' ===
  AI_PROVIDER: 'gemini',

  // === GEMINI ===
  GEMINI_API_KEY: 'AQ.Ab8RN6LUKQKKoha79f0xvUr8CeAV1AckrXF-citxJXxUHtDqDQ',
  GEMINI_MODEL: 'gemini-2.0-flash',

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
