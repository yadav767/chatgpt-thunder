import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("Please provide MONGO_URI srting ! ")
}

if (!process.env.JWT_SECRET) {
    throw new Error("Please provide JWT_SECRET srting ! ")
}

if (!process.env.NODE_ENV) {
    throw new Error("Please provide NODE_ENV srting ! ")
}

if (!process.env.API_KEY) {
    throw new Error("Please provide API_KEY srting ! ")
}

if (!process.env.REDIS_URL) {
    throw new Error("Please provide REDIS_URL srting ! ")
}

if (!process.env.TOKEN_LIMIT) {
    throw new Error("Please provide TOKEN_LIMIT srting ! ")
}

if (!process.env.TOKEN_WINDOW_SECONDS) {
    throw new Error("Please provide TOKEN_WINDOW_SECONDS srting ! ")
}



const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV:process.env.NODE_ENV,
    API_KEY:process.env.API_KEY,
    REDIS_URL:process.env.REDIS_URL,
    TOKEN_LIMIT: process.env.TOKEN_LIMIT,
    TOKEN_WINDOW_SECONDS: process.env.TOKEN_WINDOW_SECONDS
}

export default config;