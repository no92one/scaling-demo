import jwt from "jsonwebtoken";
import "dotenv/config";
import authenticate from "../auth.js";

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
        expiresIn: "30sec",
        issuer: "scaling-demo-api",
        audience: "scaling-demo-client"
      }
    );

    return response.status(201).json({
      message: "You have successfully logged in.",
      token,
      expires_in: "30 sec",
      instance
    });
  });

  server.get(path, authenticate, (request, response) => {
    return response.status(200).json({
      username: request.user.username,
      instance
    });
  });

  server.delete(path, authenticate, (request, response) => {
    return response.status(200).json({
      message: "Remove the token on the client.",
      instance
    });
  });
}