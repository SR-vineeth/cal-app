const mongoose = require("mongoose");
const companiesRoutes = require("../routes/companies");

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

module.exports = async (req, res) => {
  try {
    await connectToDatabase();

    if (req.method === "GET") {
      // Handle GET request
      const communications = await companiesRoutes.get();
      return res.json(communications);
    } else if (req.method === "POST") {
      // Handle POST request
      const newCompany = await companiesRoutes.post(req.body);
      return res.status(201).json(newCompany);
    } else if (req.method === "DELETE") {
      // Handle DELETE request
      const deletedCompany = await companiesRoutes.delete(req.query.id);
      return res.status(200).json(deletedCompany);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
