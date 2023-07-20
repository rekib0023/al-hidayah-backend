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

      const expensesByTypeMap = {};

      for (const expense of expensesByType) {
        // Sort expense.data by date in ascending order
        const sortedData = expense.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        expensesByTypeMap[expense._id] = {
          totalAmount: expense.totalAmount,
          expense: sortedData,
        };
      }

      const expenseTypeOrder = {
        "Daily Expense": 1,
        "House Rent": 2,
        Electricity: 3,
        Salary: 4,
      };

      const expenses = Object.keys(expensesByTypeMap).map((expenseType) => ({
        expenseType,
        expenseData: expensesByTypeMap[expenseType],
      }));

      expenses.sort((a, b) => {
        const expenseTypeA = a.expenseType;
        const expenseTypeB = b.expenseType;
        console.log(expenseTypeA, expenseTypeB);

        return expenseTypeOrder[expenseTypeA] - expenseTypeOrder[expenseTypeB];
      });

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
