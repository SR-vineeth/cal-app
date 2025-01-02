// api/companies.js
const express = require("express");
const companiesRoutes = require("../routes/companies");

const app = express();

// Ensure any necessary middleware (e.g., express.json) is included
app.use(express.json()); // If you're using JSON data in requests

// Use the imported route handler
app.use("/api/companies", companiesRoutes);

// Export for Vercel
module.exports = (req, res) => app(req, res);
