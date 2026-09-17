import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../utils/chatContext.js";
import config from "../config/config.js";

const ai = new GoogleGenAI({
  apiKey: config.API_KEY
});

export async function generateAiResponse({ model, messages, summary }) {

  let systemInstruction = SYSTEM_PROMPT;
  if (summary && summary.trim() !== "") {
    systemInstruction += `\n\nPrevious conversation summary:\n${summary}`;
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: messages,
    config: {
      systemInstruction,
    },
  });

  const aiReply = response.text;
  const promptTokens = response.usageMetadata?.promptTokenCount || 0;
  const completionTokens = response.usageMetadata?.candidatesTokenCount || 0;

  return {
    aiReply,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    },
  };
}