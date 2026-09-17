import express from 'express';
import userRouter from './routes/user.routes.js';
import chatRouter from './routes/chat.routes.js';
import messageRouter from './routes/message.routes.js';
import cookieParser from 'cookie-parser'
import cors from 'cors';


const app=express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))


app.use("/api/auth",userRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter);


export default app;