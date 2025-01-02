// /api/reports.js
const reportRoutes = require("../backend/routes/reports");

module.exports = (req, res) => {
  reportRoutes(req, res);
};
