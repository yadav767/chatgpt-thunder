import mongoose from "mongoose";
import chatModel from "../models/chat.model.js";

export async function createChat(req, res) {
    try {
        const userId = req.user._id;
        const { model } = req.body;

        if (!model) {
            return res.status(422).json({
                message: "Model is required !"
            })
        }

        const chats = await chatModel.create({
            userId,
            model
        })

        res.status(201).json({
            chatId: chats._id,
            userId: req.user._id,
            model,
            topic: chats.topic,
            createdAt: chats.createdAt
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }

}

export async function getChats(req, res) {
    try {
        const chats = await chatModel.find({ userId: req.user._id }).limit(20).select("topic updatedAt").sort({ updatedAt: -1 })

        if (!chats) {
            return res.status(404).json({
                message: "No chat found"
            })
        }

        res.status(200).json({
            message: "Your all recent chats",
            chats
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}

export async function getSingleChat(req, res) {
    try {
        const { chatId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                message: "Invalid chat ID !"
            })
        }

        const chat = await chatModel.findOne({ userId: req.user._id, _id: chatId });

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found !"
            })
        }

        res.status(200).json({
            chatId: chat._id,
            userId: chat.userId,
            topic: chat.topic,
            usage: chat.usage
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                message: "Invalid chat ID !"
            })
        }

        const isChatExists = await chatModel.findOne({ _id: chatId, userId: req.user._id })

        if (!isChatExists) {
            return res.status(404).json({
                message: "Chat not found !"
            })
        }

        await chatModel.findOneAndDelete({ _id: chatId, userId: req.user._id })

        res.status(200).json({
            message:"Chat successfully!"
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}