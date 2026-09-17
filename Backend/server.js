import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import redisClient from "./src/config/redis.js";

await connectDB()

await redisClient.connect();


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})