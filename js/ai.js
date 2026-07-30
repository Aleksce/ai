/**
 * AI API Integration — Gemini & Ollama
 */

const AI = {
  async sendMessage(messages, systemPrompt) {
    if (CONFIG.AI_PROVIDER === 'gemini') {
      return await AI._callGemini(messages, systemPrompt);
    } else if (CONFIG.AI_PROVIDER === 'ollama') {
      return await AI._callOllama(messages, systemPrompt);
    } else {
      throw new Error('Неизвестный AI провайдер: ' + CONFIG.AI_PROVIDER);
    }
  },

  async _callGemini(messages, systemPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

    // Конвертируем историю в формат Gemini
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const body = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 300,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API ошибка ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '...';
  },

  async _callOllama(messages, systemPrompt) {
    const url = `${CONFIG.OLLAMA_BASE_URL}/api/chat`;

    const body = {
      model: CONFIG.OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: false,
      options: { temperature: 0.75 },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama ошибка ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.message?.content || '...';
  },
};
