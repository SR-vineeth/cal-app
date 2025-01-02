const mongoose = require("mongoose");

const CommunicationSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }, // Reference to Company
  type: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
});

module.exports = mongoose.model("Communication", CommunicationSchema);
