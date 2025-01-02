const express = require("express");
const CommunicationMethod = require("../models/communicationMethod");

const router = express.Router();

// Get all communication methods
router.get("/", async (req, res) => {
  const methods = await CommunicationMethod.find().sort("sequence");
  res.json(methods);
});

// Add a communication method
router.post("/", async (req, res) => {
  const newMethod = new CommunicationMethod(req.body);
  const savedMethod = await newMethod.save();
  res.json(savedMethod);
});

// Delete a communication method
router.delete("/:id", async (req, res) => {
  await CommunicationMethod.findByIdAndDelete(req.params.id);
  res.json({ message: "Communication Method deleted" });
});

module.exports = router;
