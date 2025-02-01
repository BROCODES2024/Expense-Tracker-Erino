// app.js
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { db } = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactions");
const { protect } = require("./middlewares/authMiddleware"); // Adjust the path if necessary

dotenv.config();
db();

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Apply the protect middleware to all transactions routes
app.use("/api/transactions", protect, transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
