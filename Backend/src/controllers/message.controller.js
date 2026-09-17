import mongoose from "mongoose";
import chatModel from '../models/chat.model.js'
import messageModel from "../models/message.model.js";
import { addChatTokenUsage } from "../utils/tokenUsage.js";
import { addUserTokenUsage } from "../utils/userUsage.js";
import { buildMessagesForAI } from "../utils/chatContext.js";
import { generateAiResponse } from '../services/ai.service.js'
import redisClient from "../config/redis.js";
import config from "../config/config.js";
import { updateSummaryIfNeeded } from "../services/summaryService.js";

export async function getMessages(req, res) {
    try {
        const { chatId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                message: "Invalid chat ID"
            })
        }


        const isChatExist = await chatModel.findOne({ _id: chatId, userId: req.user._id });

        if (!isChatExist) {
            return res.status(404).json({
                message: "No chat found"
            })
        }

        const messages = await messageModel.find({
            chatId: chatId
        }).sort({ createdAt: 1 })


        if (messages.length == 0) {
            return res.status(404).json({
                message: "No message found"
            })
        }

        res.status(200).json({
            message: "Message fetched successfully ",
            messages: messages
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export async function sendMessage(req, res) {
    try {

        const { chatId } = req.params || "";
        const { content, model } = req.body;

        //Check content
        if (!content || content.trim() == "") {
            return res.status(400).json({
                message: "Message content is required!"
            })
        }


        let chat;

        if (chatId) {

            //Validate chat
            if (!mongoose.Types.ObjectId.isValid(chatId)) {
                return res.status(400).json({
                    message: "Invalid chatId"
                })
            }

            //Find chat
            chat = await chatModel.findOne({ _id: chatId, userId: req.user._id })

            if (!chat) {
                return res.status(404).json({
                    message: "Chat not found!"
                })
            }

        } else {
            //Check Model
            if (!model) {
                return res.status(400).json({
                    message: "Model is required!"
                })
            }

            //Create chat
            chat = await chatModel.create({
                userId: req.user._id,
                model,
                topic: content.trim().slice(0, 40)
            })
        }

        //Get older messages
        const oldMessages = await messageModel.find({ chatId: chat._id }).sort({ createdAt: 1 }).skip(chat.summarizedTillMessageNumber);


        //make message for AI
        const messageForAi = buildMessagesForAI({
            chat, oldMessages,
            currentMessage: content.trim()
        })

        // send message for AI
        const { aiReply, usage } = await generateAiResponse({
            model: chat.model,
            messages: messageForAi,
            summary: chat.summary
        })


        //save user message
        const userMessage = await messageModel.create({
            userId: req.user._id,
            chatId: chat._id,
            role: "user",
            content: content.trim()
        })

        //Save AI message
        const assistantMessage = await messageModel.create({
            userId: req.user._id,
            chatId: chat._id,
            role: "assistant",
            content: aiReply,
            usage
        })

        //Increase message count in chat
        chat.messageCount += 2;

        //Update chat topic
        if (chat.topic == "New chat") {
            chat.topic = content.trim().slice(0, 40)
        }

        await addChatTokenUsage(chat, usage);
        await addUserTokenUsage(req.user, usage.totalTokens);

        //Redis token logic

        const tokenUsed = await redisClient.incrBy(req.tokenUsageKey, usage.totalTokens);

        if (tokenUsed == usage.totalTokens) {
            await redisClient.expire(req.tokenUsageKey, Number(config.TOKEN_WINDOW_SECONDS));
        }

        res.status(201).json({
            message: "Message sent successfully",
            chatId: chat._id,
            reply: aiReply,
            usage,
            tokenUsed,
            tokenLimit: Number(process.env.TOKEN_LIMIT),
            userMessage,
            assistantMessage
        });

        
        updateSummaryIfNeeded(chat._id).catch((err) => {
            console.error('Summary update failed:', err);
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

