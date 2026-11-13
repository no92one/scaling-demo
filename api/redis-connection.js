import "dotenv/config";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});
redisClient.connect().catch(console.error);
console.log("Connected to Redis.");

export default redisClient;