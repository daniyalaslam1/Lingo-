import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResponse, LessonContent, Language, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GeminiService = {
  async generateLesson(language: Language, level: Difficulty): Promise<LessonContent> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a language lesson for someone learning ${language.name} at a ${level} level. 
      The lesson should include vocabulary, common phrases, and a short quiz. 
      Format the output as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['vocabulary', 'grammar', 'conversation'] },
            content: { type: Type.STRING },
            translation: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          },
          required: ["id", "title", "type", "content", "examples", "quiz"]
        }
      }
    });

    return JSON.parse(response.text);
  },

  async getFeedback(userInput: string, context: string, targetLanguage: Language): Promise<FeedbackResponse> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following ${targetLanguage.name} input: "${userInput}".
      Context of the conversation: "${context}".
      Provide feedback on correctness, grammar, and naturalness.
      Format the output as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            correction: { type: Type.STRING },
            explanation: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["isCorrect", "explanation", "suggestions"]
        }
      }
    });

    return JSON.parse(response.text);
  }
};
