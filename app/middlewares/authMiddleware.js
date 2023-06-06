const jwt = require("jsonwebtoken");
const { UserType } = require("../utils/constants");

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error("Error verifying token:", error);
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

function authenticateManagement(req, res, next) {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (decoded.type !== UserType.MANAGEMENT) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = { authenticateToken, authenticateManagement };
