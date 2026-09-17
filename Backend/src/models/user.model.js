import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: 10,
        max: 100
    },
    password: {
        type: String,
        required: true,
    },
    usage: {
        tokenUsed: {
            type: Number,
            default: 0
        },

        tokenLimit: {
            type: Number,
            default: 10000
        },

        resetAt: {
            type: Date,
            default: () => new Date(Date.now() + 5 * 60 * 60 * 1000)
        },

        totalTokenUsed: {
            type: Number,
            default: 0
        }
    }

},{timestamps:true});

const userModel = mongoose.model("user",userSchema);

export default userModel;