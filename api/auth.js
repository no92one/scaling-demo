import jwt from "jsonwebtoken";
import "dotenv/config";

export default function authenticate(request, response, next) {
  const authHeader = request.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Missing token."
    });
  }

  const token = authHeader.slice(7);

  try {
    request.user = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["HS256"],
      issuer: "scaling-demo-api",
      audience: "scaling-demo-client"
    });

    next();
  } catch (error) {
    return response.status(401).json({
      message: "Invalid or expired token."
    });
  }
}