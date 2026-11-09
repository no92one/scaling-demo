export default function login(server, path) {
  path += "/login";

  server.post(path, (request, response) => {
    const { username } = request.body;

    if (!username) {
      return response.status(400).json({
        message: "Request is missing data."
      });
    }

    request.session.user = {
      username: username
    };

    return response.status(201).json({
      message: "You have successfully logged in."
    });
  });

  server.get(path, (request, response) => {
    if (!request.session.user) {
      return response.status(404).json({
        message: "No one is logged in."
      });
    }

    return response.status(200).json({
      username: request.session.user.username
    });
  });

  server.delete(path, (request, response) => {
    request.session.destroy((error) => {
      if (error) {
        return response.status(404).json({
          message: "No one is logged in."
        });
      }
    });

    return response.status(200).json({
      message: "Logged out."
    });
  });
}