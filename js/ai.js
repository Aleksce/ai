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
    const apiKey = (CONFIG.GEMINI_API_KEY || '').trim();
    const model = CONFIG.GEMINI_MODEL || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Преобразуем историю диалога под формат Gemini API
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const body = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 300,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errorMsg = `Ошибка ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        errorMsg = errJson.error?.message || errText;
      } catch (e) {
        errorMsg = errText;
      }
      throw new Error(`Gemini API: ${errorMsg}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error('Модель вернула пустой ответ. Возможно, сработали фильтры безопасности.');
    }

    return reply;
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
