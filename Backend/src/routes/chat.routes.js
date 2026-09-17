import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.moddleware.js";
import {createChat ,getChats ,getSingleChat, deleteChat} from '../controllers/chat.controller.js'
import authenticatedRateLimiter from '../middlewares/authenticatedRateLimiter.js';
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js";

const chatRouter = Router()

chatRouter.use(authMiddleware)
chatRouter.use(authenticatedRateLimiter);
chatRouter.use(loadUserMiddleware);



chatRouter.post("/create-chat",createChat);
chatRouter.get("/get-chats",getChats);
chatRouter.get("/:chatId",getSingleChat);
chatRouter.delete("/:chatId",deleteChat);



export default chatRouter