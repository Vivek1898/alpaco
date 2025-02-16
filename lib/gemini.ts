import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEYS } from './api-config';

const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);

export async function getCryptoAnalysis(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting crypto analysis:', error);
    return 'Unable to generate analysis at this time.';
  }
}