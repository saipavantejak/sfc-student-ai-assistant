
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, DocumentFile } from "../types";

export const askGemini = async (
  apiKey: string,
  question: string,
  history: Message[],
  documents: DocumentFile[]
): Promise<{ text: string }> => {
  const ai = new GoogleGenAI({ apiKey });
  
  // Prepare history for Gemini API format
  const chatHistory = history
    .filter(msg => msg.id !== 'welcome')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

  // Current prompt parts
  const currentParts: any[] = [];
  
  // Add all uploaded documents as inlineData parts
  documents.forEach(doc => {
    currentParts.push({
      inlineData: {
        mimeType: doc.mimeType,
        data: doc.base64
      }
    });
  });
  
  // Add the user's question
  currentParts.push({ text: question });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, 
      },
    });

    return { text: response.text || "I'm sorry, I couldn't process that request." };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key")) {
       throw new Error("Invalid API Key. Please check your environment variables.");
    }
    throw error;
  }
};
