import redisClient from '../config/redis.js';
import config from '../config/config.js';

async function tokenUsageMiddleware(req, res, next) {
    try {

        const key = `token-usage:${req.userId}`;
        const tokenUsed = await redisClient.get(key);
        const totalLimit = Number(config.TOKEN_LIMIT);
 
        if (Number(tokenUsed || 0) >= totalLimit){
            const remainingTime = await redisClient.ttl(key);
            return res.status(429).json({
                message: "Token limit reached. Please try after some time.",
                tokenUsed: Number(tokenUsed),
                totalLimit,
                retryAfter: remainingTime
            })
        }

        req.tokenUsageKey = key;
        next();


    } catch (error) {
        console.error('Error in tokenUsageMiddleware:', error);
        next();
    }
}

export default tokenUsageMiddleware;