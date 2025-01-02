const express = require("express");
const Communication = require("../models/communication");
const router = express.Router();

// Endpoint to fetch report data
router.post("/data", async (req, res) => {
  try {
    const { company, startDate, endDate, method } = req.body;

    // Log incoming request for debugging
    console.log("Received request body:", req.body);

    // Build query
    const query = {};
    if (company) query.company = company;
    if (method) query.type = method;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate)) {
          return res.status(400).json({ message: "Invalid startDate" });
        }
        query.date.$gte = parsedStartDate;
      }
      if (endDate) {
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate)) {
          return res.status(400).json({ message: "Invalid endDate" });
        }
        query.date.$lte = parsedEndDate;
      }
    }

    console.log("Generated query:", query);

    // Query the database
    const communications = await Communication.find(query);
    console.log("Communications found:", communications.length);

    // Prepare the report data
    const methods = ["LinkedIn Post", "Email", "Phone Call", "Other"];
    const methodCounts = methods.map((m) =>
      communications.filter((c) => c.type === m).length
    );

    const methodEffectiveness = methods.map(() =>
      Math.random() * 100 // Placeholder for actual effectiveness logic
    );

    const trendDates = ["2024-01-01", "2024-01-02", "2024-01-03"]; // Mock trend dates
    const trendCounts = [5, 3, 8]; // Mock trend data

    // Respond with the generated data
    res.json({
      methods,
      methodCounts,
      methodEffectiveness,
      trendDates,
      trendCounts,
    });
  } catch (error) {
    console.error("Error generating report data:", error);
    res.status(500).json({ message: "Error generating report data", error });
  }
});

// Endpoint to download reports in PDF or CSV format
router.post("/download", async (req, res) => {
  try {
    const { format } = req.body;

    console.log("Report download requested with format:", format);

    if (format === "pdf") {
      // Placeholder for PDF generation logic
      res.setHeader("Content-Type", "application/pdf");
      res.send("PDF report generation is not yet implemented.");
    } else if (format === "csv") {
      // Placeholder for CSV generation logic
      res.setHeader("Content-Type", "text/csv");
      res.send("CSV report generation is not yet implemented.");
    } else {
      res.status(400).json({ message: "Invalid report format specified" });
    }
  } catch (error) {
    console.error("Error downloading report:", error);
    res.status(500).json({ message: "Error downloading report", error });
  }
});

module.exports = router;
