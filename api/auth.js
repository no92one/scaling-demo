import jwt from "jsonwebtoken";
import "dotenv/config";
import redisClient from "./redis-connection.js";

export default async function authenticate(request, response, next) {
  const authHeader = request.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Missing token."
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["HS256"],
      issuer: "scaling-demo-api",
      audience: "scaling-demo-client"
    });

    if (!decoded.jti || !Number.isInteger(decoded.exp)) {
      return response.status(401).json({
        message: "Invalid or expired token."
      });
    }

    const blacklisted = await redisClient.exists(
      `blacklist:${decoded.jti}`
    );

    if (blacklisted) {
      return response.status(401).json({
        message: "Invalid or expired token."
      });
    }

    request.user = decoded;

    next();
  } catch (error) {
    return response.status(401).json({
      message: "Invalid or expired token."
    });
  }
}