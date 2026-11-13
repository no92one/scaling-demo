import jwt from "jsonwebtoken";
import "dotenv/config";
import authenticate from "../auth.js";
import { randomUUID } from "node:crypto";
import redisClient from "../redis-connection.js";

export default function login(server, path) {
  path += "/login";

  const instance =
    process.env.INSTANCE_NAME ||
    process.env.HOSTNAME ||
    "unknown";

  server.post(path, (request, response) => {
    const { username } = request.body;

    if (!username) {
      return response.status(400).json({
        message: "Request is missing data."
      });
    }

    const token = jwt.sign(
      {
        username
      },
      process.env.TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "15m",
        issuer: "scaling-demo-api",
        audience: "scaling-demo-client",
        jwtid: randomUUID()
      }
    );

    return response.status(201).json({
      message: "You have successfully logged in.",
      token,
      expires_in: "15m",
      instance
    });
  });

  server.get(path, authenticate, (request, response) => {
    console.log(request.user)
    return response.status(200).json({
      username: request.user.username,
      instance
    });
  });

  server.delete(path, authenticate, async (request, response) => {
    try {
      const { jti, exp } = request.user;

      const now = Math.floor(Date.now() / 1000);
      const ttl = exp - now;

      if (ttl <= 0) {
        return response.status(401).json({
          message: "Invalid or expired token."
        });
      }

      await redisClient.set(
        `blacklist:${jti}`,
        "revoked",
        {
          EX: ttl
        }
      );

      return response.status(200).json({
        message: "Remove the token on the client.",
        instance
      });

    } catch (error) {
      console.error("Logout error:", error);

      return response.status(503).json({
        message: "Could not complete logout."
      });
    }
  });
}