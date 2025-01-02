const mongoose = require("mongoose");

const CommunicationMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  sequence: { type: Number, required: true },
  mandatory: { type: Boolean, default: false },
});

module.exports = mongoose.model("CommunicationMethod", CommunicationMethodSchema);
