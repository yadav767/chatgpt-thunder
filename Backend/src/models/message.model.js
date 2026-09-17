import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
        required: true
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tokens: {
        type: Number,
        default: 0
    },

    usage: {
        promptTokens: {
            type: Number,
            default: 0
        },

        completionTokens: {
            type: Number,
            default: 0
        },

        totalTokens: {
            type: Number,
            default: 0
        }
    }
},{timestamps:true});

const messageModel = mongoose.model("message",messageSchema)

export default messageModel;