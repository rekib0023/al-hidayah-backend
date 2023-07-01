const Expense = require("../models/expense");

const ExpenseController = {
  getAllExpenses: async (req, res) => {
    try {
      const expensesByType = await Expense.aggregate([
        {
          $group: {
            _id: "$expenseType",
            totalAmount: { $sum: "$amount" },
            data: { $push: "$$ROOT" },
          },
        },
      ]);

      const expensesMap = new Map();

      for (const expense of expensesByType) {
        expensesMap.set(expense._id, {
          totalAmount: expense.totalAmount,
          data: expense.data,
        });
      }

      const expenses = Array.from(
        expensesMap,
        ([expenseType, expenseData]) => ({
          [expenseType]: expenseData,
        })
      );

      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  },
  createExpense: async (req, res) => {
    try {
      const { title, description, amount, date, staffName, expenseType } =
        req.body;

      const newExpense = new Expense({
        title,
        description,
        amount,
        date,
        staffName,
        expenseType,
      });

      const savedExpense = await newExpense.save();

      res.status(201).json(savedExpense);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: "Failed to create expense" });
    }
  },
};

module.exports = ExpenseController;
