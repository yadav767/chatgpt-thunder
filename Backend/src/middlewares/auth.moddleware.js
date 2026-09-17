import jwt from 'jsonwebtoken'
import config from '../config/config.js';
import userModel from '../models/user.model.js';
import redisClient from '../config/redis.js'

export async function authMiddleware(req, res, next) {
    try {
        const { token } = req.cookies

        if (!token) {
            return res.status(401).json({
                message: "Please login first!"
            })
        }

        const payload = jwt.verify(token, config.JWT_SECRET);

        //Check if the token is blocked or not 

        const isTokenBlocklist = await redisClient.get(`Blocklist:${token}`)

        if (isTokenBlocklist) {
            return res.status(401).json({
                message: "Please login again !"
            })
        }


        req.userId = payload.id;
        req.payload = payload;
        req.token = token;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}