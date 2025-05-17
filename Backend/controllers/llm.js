require('dotenv').config();
const fetch = require('node-fetch'); // v2 if using require()

async function getLLMResponse(userMessage) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) throw new Error("Missing OpenRouter API key");

  const body = {
    model: "openai/gpt-3.5-turbo", // Make sure this model is accessible via your API key
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: userMessage,
      }
    ]
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.BACKEND_URL // REQUIRED by OpenRouter
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`LLM Error: ${res.status} - ${errorBody}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

module.exports = { getLLMResponse };
