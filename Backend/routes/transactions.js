const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

// Apply the middleware to all routes in this router
router.use(protect);

const {
  addIncome,
  getIncomes,
  deleteIncomes,
  updateIncome,
} = require("../controllers/income");

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require("../controllers/expense");

router.post("/add-income", addIncome);
router.get("/get-incomes", getIncomes);
router.delete("/delete-income/:id", deleteIncomes);
router.put("/update-income/:id", updateIncome);

router.post("/add-expense", addExpense);
router.get("/get-expenses", getExpenses);
router.delete("/delete-expense/:id", deleteExpense);
router.put("/update-expense/:id", updateExpense);

module.exports = router;
