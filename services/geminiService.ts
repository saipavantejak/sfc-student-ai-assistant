
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, DocumentFile } from "../types";

export const askGeminiStream = async function* (
  apiKey: string,
  question: string,
  history: Message[],
  documents: DocumentFile[]
) {
  const ai = new GoogleGenAI({ apiKey });
  
  const chatHistory = history
    .filter(msg => msg.id !== 'welcome')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

  const currentParts: any[] = [];
  
  documents.forEach(doc => {
    currentParts.push({
      inlineData: {
        mimeType: doc.mimeType,
        data: doc.base64
      }
    });
  });
  
  currentParts.push({ text: question });

  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Lower temperature for more consistent formatting
      },
    });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) yield text;
    }
  } catch (error: any) {
    console.error("Gemini Streaming Error:", error);
    throw error;
  }
};
