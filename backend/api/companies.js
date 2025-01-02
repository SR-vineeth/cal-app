// /api/companies.js
const companyRoutes = require("../backend/routes/companies");

module.exports = (req, res) => {
  companyRoutes(req, res);
};
