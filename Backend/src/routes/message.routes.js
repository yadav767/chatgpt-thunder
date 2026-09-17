import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.moddleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import authenticatedRateLimiter from '../middlewares/authenticatedRateLimiter.js';
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js";
import tokenUsageMiddleware from '../middlewares/tokenUsageMiddleware.js'

const messageRouter = Router()


messageRouter.post("/", authMiddleware, authenticatedRateLimiter, tokenUsageMiddleware, loadUserMiddleware, sendMessage)

messageRouter.get("/:chatId", authMiddleware, authenticatedRateLimiter, tokenUsageMiddleware, loadUserMiddleware, getMessages)
messageRouter.post("/:chatId", authMiddleware, authenticatedRateLimiter, tokenUsageMiddleware, loadUserMiddleware, sendMessage)



export default messageRouter;