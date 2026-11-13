import bookings from "./routes/bookings.js";
import login from "./routes/login.js";

export default function routesRegister(server) {
  const path = "/api";

  server.get(`${path}/health`, (request, response) => {
    return response.status(200).json({
      message: "ok"
    });
  });

  server.get(`${path}/instance`, (request, response) => {
    const instance =
      process.env.INSTANCE_NAME ||
      process.env.HOSTNAME ||
      "unknown";

    return response.status(200).json({
      instance_name: instance
    });
  });

  bookings(server, path);
  login(server, path);

}