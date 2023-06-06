const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
          }

          const token = jwt.sign(
            { userId: user._id, email: user.email, type: user.type },
            process.env.JWT_SECRET
          );

          res.cookie("token", token, { httpOnly: true });

          res.json({ message: "Logged in" });
        })
        .catch((error) => {
          console.error("Error comparing passwords:", error);
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports = loginController;
