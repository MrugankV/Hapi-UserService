const userHandlers = require("../handlers/userHandlers");

const userRoutes = [
  {
    method: "POST",
    path: "/createusers",
    handler: userHandlers.createUser,
    options: {
      auth: {
        strategy: "jwt", // JWT Authentication
        // access: {
        //   scope: ["create:user"], // Required scopes/Authorization
        // },
      },
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: userHandlers.loginUser,
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: userHandlers.getUser,
    options: {
      auth: "jwt", // Route protected using JWT strategy
    },
  },
];

module.exports = userRoutes;
