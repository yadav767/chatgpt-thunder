import redisClient  from '../config/redis.js'

async function authenticatedRateLimiter(req, res, next) {

    try {

        const userId = req.userId; // Assuming you have user authentication and the user ID is available in req.user

        const key = `rate-limiter:user:${userId}`;

        const requestCounts = await redisClient.incr(key); // This increase the value if it exists ,if not then it create it with the value 1

        if (requestCounts == 1) {
            await redisClient.expire(key , 60);
        }

        if(requestCounts > 20){
            const remainingTime = await redisClient.ttl(key);

            return res.status(429).json({
                message :`Too many requests please try after ${remainingTime} seconds !` 
            })
        }

        next();


    } catch (error) {
        console.log("authenticated rate limiter error :", error);
        next()
    }

}

export default authenticatedRateLimiter;