import "dotenv/config";
import express from "express";
import session from "express-session";

import pool from "./db.js";

import routesRegister from "./routes-register.js";


const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());
server.use(session({
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