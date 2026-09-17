import { Router } from 'express';
import { register, login, logout, profile, deleteUser } from '../controllers/user.conroller.js'
import { authMiddleware } from '../middlewares/auth.moddleware.js';
import unauthenticatedRateLimiter from '../middlewares/unauthenticatedRateLimiter.js';
import authenticatedRateLimiter from '../middlewares/authenticatedRateLimiter.js';
import loadUserMiddleware from '../middlewares/loadUserMiddleware.js'

const userRouter = Router();

userRouter.post("/register", unauthenticatedRateLimiter, register)
userRouter.post("/login", unauthenticatedRateLimiter, login)
userRouter.delete("/logout", authMiddleware, logout)
userRouter.get("/profile",unauthenticatedRateLimiter, authMiddleware, authenticatedRateLimiter, loadUserMiddleware, profile)

//Delete user
userRouter.delete("/account", authMiddleware, authenticatedRateLimiter, loadUserMiddleware, deleteUser)



export default userRouter