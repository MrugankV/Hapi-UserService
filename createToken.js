const Jwt = require("@hapi/jwt");
const dotenv = require("dotenv");
dotenv.config();
const generateToken = () => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const expiresIn = 14400; // Token validity period in seconds (e.g., 1 hour)
  const token = Jwt.token.generate(
    {
      userId: 1,
      email: "bk123@gmail.com",
      role: "admin",
      scopes: ["create:user"], // Include required scopes
      iat: now, // Issued At: Current time
      exp: now + expiresIn, // Expiration Time: Current time + 1 hour
    },
    { key: process.env.JWT_SECRET, algorithm: "HS256" }
  );
  console.log(token);
};

generateToken();

// const jwt = require("jsonwebtoken");
