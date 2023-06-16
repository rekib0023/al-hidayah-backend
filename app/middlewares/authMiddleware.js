const jwt = require("jsonwebtoken");

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

function checkPermissions(requiredUserTypes) {
  return function (req, res, next) {
    const userType = req.user.type;

    const hasPermissions = requiredUserTypes.includes(userType);

    if (!hasPermissions) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  checkPermissions,
};
