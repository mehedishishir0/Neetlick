const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
     throw createError(400, "invalid credentials");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
    throw  createError(400, "invalid credentials");
    }
    req.userid = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuthenticated;
