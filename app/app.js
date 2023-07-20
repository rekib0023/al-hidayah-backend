const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const { authenticateToken } = require("./middlewares/authMiddleware");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const managementRoutes = require("./routes/management");
const noticeRoutes = require("./routes/notice");
const eventRoutes = require("./routes/event");
const expenseRoutes = require("./routes/expense");
const inventoryRoutes = require("./routes/inventory");
const orderRoutes = require("./routes/order");
const admissionRoutes = require("./routes/admission");



const connectToDatabase = require("./config/database");

require("dotenv").config();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/notices", authenticateToken, noticeRoutes);
app.use("/api/management", authenticateToken, managementRoutes);
app.use("/api/events", authenticateToken, eventRoutes);
app.use("/api/expenses", authenticateToken, expenseRoutes);
app.use("/api/inventory", authenticateToken, inventoryRoutes);
app.use("/api/order", authenticateToken, orderRoutes);
app.use("/api/admission", authenticateToken, admissionRoutes);



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
