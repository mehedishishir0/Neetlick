const jwt = require("jsonwebtoken");

const createJwtToken = (data, jwtSecret, expireIn) => {
  if (typeof data !== "object" || !data) {
    throw new Error("data must be a non-empty object");
  }
  if (typeof jwtSecret !== "string" || jwtSecret === "") {
    throw new Error("jwt Secret ley must be a non-empty string");
  }
  try {
    if (expireIn) {
      const token = jwt.sign(data, jwtSecret, { expiresIn: expireIn });
      return token;
    } else {
      const token = jwt.sign(data, jwtSecret);
      return token;
    }
  } catch (error) {
    console.error("Failed to sign the JWT: ", error);
    throw error;
  }
};

module.exports = createJwtToken;