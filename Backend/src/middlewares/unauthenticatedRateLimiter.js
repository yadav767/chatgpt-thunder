import redisClient  from '../config/redis.js'

async function unauthenticatedRateLimiter(req, res, next) {

    try {

        const key = `rate-limiter:ip:${req.ip}`;

        const requestCounts = await redisClient.incr(key); // This increase the value if it exists ,if not then it create it with the value 1

        if (requestCounts == 1) {
            await redisClient.expire(key, 60);
        }

        if (requestCounts > 10) {
            const remainingTime = await redisClient.ttl(key);

            return res.status(429).json({
                message: `Too many requests please try after ${remainingTime} seconds !`
            })
        }

        next();


    } catch (error) {
        console.log("Unauthenticated rate limiter error :", error);
        next()
    }

}
export default unauthenticatedRateLimiter;