const Jwt = require("@hapi/jwt");

const generateToken = async (user) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const expiresIn = 14400; // Token validity period in seconds (e.g., 4 hours)

  const token = Jwt.token.generate(
    {
      userId: user.id, // Use user ID from Sequelize model
      email: user.email, // Use email from Sequelize model
      role: user.role, // Use role from Sequelize model
      scopes: user.scopes || [], // Include required scopes
      iat: now, // Issued At: Current time
      exp: now + expiresIn, // Expiration Time: Current time + validity period
    },
    process.env.JWT_SECRET, // Use your secret from the environment variable
    { algorithm: "HS256" } // Set the algorithm
  );

  return token;
};

module.exports = {
  generateToken: generateToken,
};
