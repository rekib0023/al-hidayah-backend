const Expense = require("../models/expense");
const XLSX = require("xlsx");
const JSZip = require("jszip");
const fs = require("fs");

const ExpenseController = {
  getAllExpenses: async (req, res) => {
    try {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);

      // Add the date filtering stage to the aggregate pipeline
      const expensesByType = await Expense.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
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

  getAuditFile: async (req, res) => {
    try {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);

      // Add the date filtering stage to the aggregate pipeline
      const expensesByType = await Expense.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
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

      const houseRent = expenses.filter((expense) => {
        const expenseType = expense.expenseType;
        return expenseType === "House Rent";
      });
      const electricity = expenses.filter((expense) => {
        const expenseType = expense.expenseType;
        return expenseType === "Electricity";
      });
      const daily = expenses.filter((expense) => {
        const expenseType = expense.expenseType;
        return expenseType === "Daily Expense";
      });
      const salary = expenses.filter((expense) => {
        const expenseType = expense.expenseType;
        return expenseType === "Salary";
      });

      const houseRentExpense = houseRent[0].expenseData.expense;
      const electricityExpense = electricity[0].expenseData.expense;
      const dailyExpense = daily[0].expenseData.expense;
      const salaryExpense = salary[0].expenseData.expense;

      const createExcelFile = (data, sheetName) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(
          data.map((entry) => {
            const month = new Date(entry.date).toLocaleString("default", {
              month: "long",
            });
            const amount = entry.amount;
            const date = new Date(entry.date);
            const formattedDate = `${date
              .getDate()
              .toString()
              .padStart(2, "0")}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getFullYear()}`;

            return { Month: month, Amount: amount, Date: formattedDate };
          })
        );
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      };

      const zip = new JSZip();
      zip.file(
        "House_Rent_Expenses.xlsx",
        createExcelFile(houseRentExpense, "House Rent Expenses")
      );
      zip.file(
        "Electricity_Expenses.xlsx",
        createExcelFile(electricityExpense, "Electricity Expenses")
      );

      const createExcelFileByMonth = (data) => {
        const workbook = XLSX.utils.book_new();

        // Group data by month
        const dataByMonth = data.reduce((acc, entry) => {
          const month = new Date(entry.date).toLocaleString("default", {
            month: "long",
          });
          if (!acc[month]) {
            acc[month] = [];
          }
          acc[month].push(entry);
          return acc;
        }, {});

        // Create separate sheets for each month
        for (const month in dataByMonth) {
          const worksheet = XLSX.utils.json_to_sheet(
            dataByMonth[month].map((entry) => {
              const date = new Date(entry.date);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;

              const amount = entry.amount;
              if (entry.staffName !== "") {
                return {
                  Staff: entry.staffName,
                  Amount: amount,
                  Date: formattedDate,
                };
              } else {
                return {
                  Title: entry.title,
                  Description: entry.description,
                  Amount: amount,
                  Date: formattedDate,
                };
              }
            })
          );
          XLSX.utils.book_append_sheet(workbook, worksheet, month);
        }

        return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      };

      zip.file("Daily_Expenses.xlsx", createExcelFileByMonth(dailyExpense));
      zip.file("Salary_Expenses.xlsx", createExcelFileByMonth(salaryExpense));

      const zipFileName = "expenses.zip";
      zip
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(fs.createWriteStream(zipFileName))
        .on("finish", () => {
          res.setHeader("Content-Type", "application/zip");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${zipFileName}`
          );
          res.sendFile(zipFileName, { root: "." }, (err) => {
            fs.unlinkSync(zipFileName);
          });
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  },
};

module.exports = ExpenseController;
