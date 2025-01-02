const express = require("express");
const Company = require("../models/company");
const Communication = require("../models/communication"); // Include the communication model

const router = express.Router();

// Get all companies
router.get("/", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

// Add a company
router.post("/", async (req, res) => {
  const newCompany = new Company(req.body);
  const savedCompany = await newCompany.save();
  res.json(savedCompany);
});

// Update a company
router.put("/:id", async (req, res) => {
  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedCompany);
});

// Delete a company and its related communications
router.delete("/:id", async (req, res) => {
  try {
    // Delete the company
    await Company.findByIdAndDelete(req.params.id);

    // Delete all communications related to the company
    await Communication.deleteMany({ company: req.params.id });

    res.json({ message: "Company and related communications deleted" });
  } catch (error) {
    console.error("Error deleting company and related communications:", error);
    res.status(500).json({ message: "Error deleting company and related communications" });
  }
});

module.exports = router;
