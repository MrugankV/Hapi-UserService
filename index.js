const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");
const HapiJwt = require("hapi-auth-jwt2");
const HapiRateLimit = require("hapi-rate-limit");
const Crumb = require("@hapi/crumb");

// Load environment variables from .env file
const User = require("./models/user");
dotenv.config();

// Import user routes
const userRoutes = require("./routes/userRoutes");

// // Mock user database for demonstration
// const users = {};

// Initialize Sequelize instance

const { sequelize, DataTypes } = require("./dbConfig");
// Check connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

const validateUserRoleAndScopes = (payload) => {
  const { role, scopes } = payload;
  console.log(payload);

  // Example validation logic
  if (role !== "admin" || "user") {
    return false; // Only allow admin role
  }

  // Check if required scopes are present
  const requiredScopes = ["create:user", "view:user"]; // Define required scopes for this route
  const hasRequiredScopes = requiredScopes.every((scope) =>
    scopes.includes(scope)
  );
  console.log("hasrequired", hasRequiredScopes);
  return hasRequiredScopes; // Returns true if all required scopes are present
};

const init = async () => {
  // Create Hapi server with security headers
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    debug: { request: ["error"] },
    routes: {
      security: {
        hsts: true, // Enable HTTP Strict Transport Security
        xframe: "deny", // Prevent clickjacking with X-Frame-Options
        xss: "enabled", // Enable XSS protection
        noOpen: true, // Prevent file download/open in some browsers
        noSniff: true, // Prevent MIME type sniffing
      },
    },
  });

  // Register plugins: JWT authentication,Ratelimit plugin and Crumb (CSRF protection)
  await server.register([
    HapiJwt,
    {
      plugin: HapiRateLimit,
      options: {
        userLimit: 100, // Limit each user to 100 requests
        userCache: {
          expiresIn: 60 * 1000, // Cache user requests for 1 minute
        },
        // Additional options can be set here
        // For example, for global limits
        // globalLimit: 1000, // Limit all users to 1000 requests
      },
    },
    // {
    //   plugin: Crumb,
    //   options: {
    //     key: "csrf", // Name of the CSRF cookie
    //     size: 43, // Size of the generated token
    //     autoGenerate: true, // Automatically generate CSRF tokens
    //     addToViewContext: true,
    //     cookieOptions: {
    //       isSecure: false, // Set to true in production (requires HTTPS)
    //       isHttpOnly: true, // Restrict cookie access to HTTP(S)
    //     },
    //   },
    // },
  ]);

  // Define JWT authentication strategy
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true, // Validate 'nbf' (Not Before)
      exp: true, // Validate 'exp' (Expiration Time)
      maxAgeSec: 14400, // Maximum age in seconds (e.g., 4 hours)
      timeSkewSec: 15, // Allowable skew time in seconds
    },
    validate: async (decoded, request, h) => {
      // Implement your validation logic here
      let usercheck = await User.findOne({
        where: {
          email: decoded.email,
        },
      });

      // const hasRequiredScopes = decoded.scopes.includes("create:user");
      if (!usercheck) {
        console.log("Invalid User");
        return { isValid: false }; // Invalid User
      }
      console.log(decoded);
      console.log({ isValid: true, credentials: decoded });
      return { isValid: true, credentials: decoded }; // Return decoded token as credentials
    },
    verifyOptions: { algorithms: ["HS256"] },
  });

  // Set the default authentication strategy to JWT
  server.auth.default("jwt");

  // Register user routes
  server.route(userRoutes);
  server.ext("onPreHandler", (request, h) => {
    console.log("Incoming Request:", request.method, request.path);
    console.log("Authorization Header:", request.headers.authorization);
    return h.continue;
  });
  // Add CSP headers (optional security enhancement)
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      //Add Rate Limit handling
      const { output } = request.response;

      if (output.statusCode === 429) {
        return h
          .response({
            message: "Rate limit exceeded. Please try again later.",
          })
          .code(429)
          .takeover();
      }
      console.error(
        "Error Response:",
        response.output.statusCode,
        response.output.payload.message
      );
      return h.continue;
    }

    response.header("Content-Security-Policy", "default-src 'self'");
    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
