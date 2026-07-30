/**
 * AI API Integration — Groq, Gemini & Ollama
 */

const AI = {
  async sendMessage(messages, systemPrompt) {
    if (CONFIG.AI_PROVIDER === 'groq') {
      return await AI._callGroq(messages, systemPrompt);
    } else if (CONFIG.AI_PROVIDER === 'gemini') {
      return await AI._callGemini(messages, systemPrompt);
    } else if (CONFIG.AI_PROVIDER === 'ollama') {
      return await AI._callOllama(messages, systemPrompt);
    } else {
      throw new Error('Неизвестный AI провайдер: ' + CONFIG.AI_PROVIDER);
    }
  },

  async _callGroq(messages, systemPrompt) {
    const apiKey = (CONFIG.GROQ_API_KEY || '').trim();
    const model = CONFIG.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const body = {
      model: model,
      messages: formattedMessages,
      temperature: 0.75,
      max_tokens: 300,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`Groq API: ${errorMsg}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '...';
  },

  async _callGemini(messages, systemPrompt) {
    const apiKey = (CONFIG.GEMINI_API_KEY || '').trim();
    const model = CONFIG.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: contents,
        generationConfig: { temperature: 0.75, maxOutputTokens: 300 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API ошибка ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '...';
  },

  async _callOllama(messages, systemPrompt) {
    const url = `${CONFIG.OLLAMA_BASE_URL}/api/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.OLLAMA_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama ошибка ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.message?.content || '...';
  },
};
