const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/user");
const { authenticateToken } = require("./middlewares/authMiddleware");

const connectToDatabase = require("./config/database");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", loginRoutes);
app.use("/api", authenticateToken, userRoutes);

connectToDatabase()
  .then(() => {
    app.listen(3001, () => {
      console.log("Server started on port 3001");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });
