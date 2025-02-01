const Income = require("../models/IncomeModel");

// Add a new income (attached to the authenticated user)
exports.addIncome = async (req, res) => {
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
    const income = new Income({
      title,
      amount,
      category,
      description,
      date,
      user: req.user.id, // Associate the income with the logged-in user
    });
    await income.save();
    res.status(200).json({ message: "Income added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all incomes for the authenticated user with pagination and filtering
exports.getIncomes = async (req, res) => {
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
    const incomes = await Income.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Also get the total count for pagination metadata
    const total = await Income.countDocuments(query);

    res.status(200).json({
      incomes,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete an income (only if it belongs to the authenticated user)
exports.deleteIncomes = async (req, res) => {
  const { id } = req.params;
  try {
    const income = await Income.findById(id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Check if the income belongs to the logged-in user
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await income.remove();
    res.status(200).json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update an income (only if it belongs to the authenticated user)
exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, description, date } = req.body;

  try {
    const income = await Income.findById(id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Check if the income belongs to the logged-in user
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields if new values are provided
    income.title = title || income.title;
    income.amount = amount || income.amount;
    income.category = category || income.category;
    income.description = description || income.description;
    income.date = date || income.date;

    await income.save();
    res.status(200).json({ message: "Income updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
