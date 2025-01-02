// api/companies.js
const express = require("express");
const mongoose = require("mongoose");
const companiesRoutes = require("../routes/companies");

const app = express();

// MongoDB connection setup with caching to avoid multiple connections
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = connection;
  return cachedDb;
};

app.use(express.json()); // Use JSON parser middleware

// Use the imported route handler
app.use("/api/companies", companiesRoutes);

// MongoDB connection before handling requests
app.all("*", async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Error connecting to database:", error);
    res.status(500).send("Error connecting to the database");
  }
});

// Export for Vercel
module.exports = (req, res) => app(req, res);
