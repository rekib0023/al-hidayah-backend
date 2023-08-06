const jwt = require("jsonwebtoken");

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } 
  return null;
}

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    const bearerToken = getToken(req);
    if (bearerToken){
      jwt.verify(bearerToken, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          console.error("Error verifying token:", error);
          return res.status(403).json({ message: "Invalid token" });
        }
    
        req.user = decoded;
        next();
      });
      return;
    }
    else {
      return res.status(401).json({ message: "Missing token" });
    } 
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
