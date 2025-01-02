const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  linkedIn: { type: String },
  emails: [String],
  phoneNumbers: [String],
  comments: { type: String },
  periodicity: { type: String, default: "2 weeks" },
  lastCommunication: { type: Date }, // Ensure this field exists
  nextCommunication: { type: Date }, // Ensure this field exists
});

module.exports = mongoose.model("Company", CompanySchema);
