//expense.js
const Expense = require("../models/ExpenseModel");

// Add a new expense (attached to the authenticated user)
exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  // Validate required fields
  if (!title || !category || !date) {
    return res
      .status(400)
      .json({ message: "Title, category, and date are required" });
  }
  if (amount <= 0 || typeof amount !== "number") {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number!" });
  }

  try {
    const expense = new Expense({
      title,
      amount,
      category,
      description,
      date,
      user: req.user.id, // Associate the expense with the logged-in user
    });
    await expense.save();
    res.status(200).json({ message: "Expense added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all expenses for the authenticated user with pagination and filtering
exports.getExpenses = async (req, res) => {
  try {
    // Retrieve query parameters
    const { page = 1, limit = 4, category, startDate, endDate } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Build the query object with the user's ID
    const query = { user: req.user.id };

    // Add filtering by category if provided
    if (category) {
      query.category = category;
    }

    // Add filtering by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Query the database with pagination
    const expenses = await Expense.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Also get the total count for pagination metadata
    const total = await Expense.countDocuments(query);

    res.status(200).json({
      expenses,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete an expense (only if it belongs to the authenticated user)
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check if the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.remove();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update an expense (only if it belongs to the authenticated user)
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, description, date } = req.body;

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check if the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields if new values are provided
    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.description = description || expense.description;
    expense.date = date || expense.date;

    await expense.save();
    res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
