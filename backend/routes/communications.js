const express = require("express");
const Communication = require("../models/communication");
const Company = require("../models/company");

const router = express.Router();

// Get all communications
router.get("/", async (req, res) => {
  try {
    const communications = await Communication.find().populate("company");
    res.json(communications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching communications", error });
  }
});

// Add a communication
router.post("/", async (req, res) => {
  try {
    const { company, date } = req.body;

    // Create a new communication
    const newCommunication = new Communication(req.body);
    await newCommunication.save();

    // Find the company and update its lastCommunication and nextCommunication
    const companyDetails = await Company.findById(company);
    if (!companyDetails) {
      return res.status(404).json({ message: "Company not found" });
    }

    const periodicityInDays = parseInt(companyDetails.periodicity.split(" ")[0], 10) || 14;
    const nextCommunicationDate = new Date(date);
    nextCommunicationDate.setDate(nextCommunicationDate.getDate() + periodicityInDays);

    await Company.findByIdAndUpdate(company, {
      lastCommunication: date,
      nextCommunication: nextCommunicationDate,
    });

    res.status(201).json(newCommunication);
  } catch (error) {
    res.status(500).json({ message: "Error logging communication", error });
  }
});

// Delete a communication
router.delete("/:id", async (req, res) => {
  try {
    await Communication.findByIdAndDelete(req.params.id);
    res.json({ message: "Communication deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting communication", error });
  }
});

module.exports = router;
