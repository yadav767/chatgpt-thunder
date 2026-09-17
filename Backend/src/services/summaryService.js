import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import { generateAiResponse } from "./ai.service.js";

const SUMMARY_CHUNK_SIZE = 20;

export const updateSummaryIfNeeded = async (chatId) => {
  const chat = await chatModel.findById(chatId);

  if (!chat) return;

  const unsummarizedCount =
    chat.messageCount - chat.summarizedTillMessageNumber;

    console.log('messageCount:', chat.messageCount, 'summarizedTill:', chat.summarizedTillMessageNumber, 'unsummarized:', unsummarizedCount);


  if (unsummarizedCount < SUMMARY_CHUNK_SIZE) {
    return;
  }

  const messagesToSummarize = await messageModel.find({
    chatId: chat._id,
  })
    .sort({ createdAt: 1 })
    .skip(chat.summarizedTillMessageNumber)
    .limit(SUMMARY_CHUNK_SIZE);

  if (messagesToSummarize.length === 0) return;


  const summaryMessages = [
    {
      role: "user",
      parts: [{ text: `Previous summary: ${chat.summary || "No previous summary yet."}. Summarize the conversation, keeping important context, user goals, decisions, and unresolved doubts. Do not add extra information.` }]
    },
    ...messagesToSummarize.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    })),
    {
      role: "user",
      parts: [{ text: "Summarize the above conversation." }]
    }
  ];


  const { aiReply, usage } = await generateAiResponse({
    model: chat.model,
    messages: summaryMessages,
  });

  console.log(aiReply);

  chat.summary = aiReply;
  chat.summaryUpdatedAt = new Date();
  chat.summarizedTillMessageNumber += messagesToSummarize.length;

  chat.usage.promptTokens += usage.promptTokens;
  chat.usage.completionTokens += usage.completionTokens;
  chat.usage.totalTokens += usage.totalTokens;

  await chat.save();

  const user = await userModel.findById(chat.userId);

  if (user) {
    user.usage.totalTokenUsed += usage.totalTokens;
    await user.save();
  }
};
