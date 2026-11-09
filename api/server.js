import "dotenv/config";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "./db.js";
import routesRegister from "./routes-register.js";

const server = express();
const port = process.env.PORT || 3000;

const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool,
  tableName: "user_sessions",
  createTableIfMissing: true,
  pruneSessionInterval: 30
});

server.use(express.json());
server.use(session({
  store: sessionStore,
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