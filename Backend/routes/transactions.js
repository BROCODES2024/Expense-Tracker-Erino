//transactions.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

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

// ✅ Apply `protect` ONLY to routes requiring authentication
router.post("/add-income", protect, addIncome);
router.get("/get-incomes", protect, getIncomes);
router.delete("/delete-income/:id", protect, deleteIncomes);
router.put("/update-income/:id", protect, updateIncome);

router.post("/add-expense", protect, addExpense);
router.get("/get-expenses", protect, getExpenses);
router.delete("/delete-expense/:id", protect, deleteExpense);
router.put("/update-expense/:id", protect, updateExpense);

module.exports = router;
