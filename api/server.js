import "dotenv/config";
import express from "express";

import pool from "./db.js";

import routesRegister from "./routes-register.js";

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());

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