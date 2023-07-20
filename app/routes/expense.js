const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.post(
  "/",
  checkPermissions([UserType.MANAGEMENT]),
  expenseController.createExpense
);

router.get("/", expenseController.getAllExpenses);

module.exports = router;
