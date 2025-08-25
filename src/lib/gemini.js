import { GoogleGenerativeAI } from '@google/generative-ai';

let client;

export function getGeminiClient() {
  if (client) return client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
  client = new GoogleGenerativeAI(apiKey);
  return client;
}

export function getModel(modelName = 'gemini-1.5-pro', opts = {}) {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({ model: modelName, ...opts });
} 