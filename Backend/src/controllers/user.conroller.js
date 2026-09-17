import { validateRegister, validateLogin } from "../validators/userValidator.js";
import userModel from "../models/user.model.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from "../config/config.js";
import redisClient from "../config/redis.js";

async function register(req, res) {

    try {
        const result = validateRegister.safeParse(req.body);

        //Validate data

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

        const { name, email, password } = result.data;

        //Check weather the user already exists ?

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                message: "User already exists !"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Set data in database
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        //create token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, config.JWT_SECRET, { expiresIn: '1h' });

        //store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000
        });

        //send res
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}

async function login(req, res) {
    try {
        const result = validateLogin.safeParse(req.body)
        //Validate body data
        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

        const { email, password } = result.data;

        //Check user exists or not (email and password )
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User not found please register first !"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid credentials !"
            })
        }

        //create token
        const token = jwt.sign({ id: user._id, email: user.email }, config.JWT_SECRET, { expiresIn: '1h' })

        //Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000
        })

        //Send res
        res.json({
            message: "User logged in successfully !",
            user: {
                name: user.name,
                email: user.email
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}

async function logout(req, res) {
    try {

        const token = req.token;

        if (token) {
            const payload = req.payload;

            const currentTime = Math.floor(Date.now() / 1000) // seconds

            const remainingTime = payload.exp - currentTime;

            if (remainingTime > 0) {
                await redisClient.set(`Blocklist:${token}`, "blocked", { EX: remainingTime })
            }
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
        })
        res.json({
            message: "User log out successfully !"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}

async function profile(req, res) {
    res.json({
        message: "User fetched successfully !",
        user: req.user
    })
}

async function deleteUser(req, res) {
    try {
        const userId = req.user._id;
        const chats = await chatModel.find({ userId }).select("_id")

        const chatIds = chats.map((chat) => chat._id)

        await messageModel.deleteMany({
            chatId: { $in: chatIds }
        });

        await chatModel.deleteMany({
            userId
        })

        await userModel.findOneAndDelete({
            _id: userId
        })

        res.clearCookie("token", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax"
        });

        res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}


export { register, login, logout, profile, deleteUser }