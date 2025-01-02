const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const companyRoutes = require("./routes/companies");
const communicationRoutes = require("./routes/communications");
const methodRoutes = require("./routes/communicationMethods");
const reportRoutes = require("./routes/reports"); // Import reports route

const app = express();

// Middleware for CORS
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? "https://calendar-app-iota-six.vercel.app"  // Replace with your production frontend URL
    : "http://localhost:3000",  // Local development URL
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions)); // Use dynamic CORS based on environment
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/companies", companyRoutes);
app.use("/api/communications", communicationRoutes);
app.use("/api/communication-methods", methodRoutes);
app.use("/api/reports", reportRoutes); // Add reports route

// Root Route (for testing if the backend is running)
app.get("/", (req, res) => {
  res.send("Backend is running and ready!");
});

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for Vercel or other serverless platforms
module.exports = app;
