const mongoose = require("mongoose");
const Communication = require("../routes/communications");
const Company = require("../routes/companies");

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

// API handler for the /api/communications route
module.exports = async (req, res) => {
  try {
    // Connect to the database
    const db = await connectToDatabase();

    // Route logic based on the HTTP method
    if (req.method === "GET") {
      // Get all communications (with populated company details)
      const communications = await Communication.find().populate("company");
      res.status(200).json(communications);

    } else if (req.method === "POST") {
      // Add a new communication
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

    } else if (req.method === "DELETE") {
      // Delete a communication by ID
      const communicationId = req.query.id;
      await Communication.findByIdAndDelete(communicationId);
      res.status(200).json({ message: "Communication deleted" });

    } else {
      // Handle unsupported HTTP methods
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    // Catch and return any errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
