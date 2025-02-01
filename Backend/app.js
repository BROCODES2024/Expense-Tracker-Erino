//app.js
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { db } = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactions");

dotenv.config();
db();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Allow frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes); // ✅ Removed global protect middleware

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
