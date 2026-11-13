import "dotenv/config";
import express from "express";
import session from "express-session";

import pool from "./db.js";

import routesRegister from "./routes-register.js";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

const server = express();
const port = process.env.PORT || 3000;

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

server.use(express.json());
server.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 120000
  }
}));

async function startServer() {
  try {
    console.log("Connected to Database.");
    await pool.query("SELECT 1;");

    console.log("Connected to Database.");

    routesRegister(server);

    server.listen(port, () => {
      console.log(`Server is live at http://localhost:${port}`);
    });

  } catch (error) {
    console.log(error);
  }
};

startServer();