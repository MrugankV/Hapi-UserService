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
    options: {
      auth: false, // Disable JWT authentication for this route
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: userHandlers.getUser,
    options: {
      auth: "jwt", // Route protected using JWT strategy
    },
  },

  {
    method: "GET",
    path: "/users/",
    handler: userHandlers.getAllUsers,
    options: {
      auth: "jwt", // Route protected using JWT strategy
    },
  },
];

module.exports = userRoutes;
