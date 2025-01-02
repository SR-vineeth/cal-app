import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { fetchReportData, downloadReport } from "../../services/api";
import { Button, Form, Table } from "react-bootstrap";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function ReportingDashboard() {
  const [reportData, setReportData] = useState({
    methods: [],
    methodCounts: [],
    methodEffectiveness: [],
    trendDates: [],
    trendCounts: [],
  });
  const [filters, setFilters] = useState({
    company: "",
    startDate: "",
    endDate: "",
    method: "",
  });
  const [activityLog, setActivityLog] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await fetchReportData(filters);
        console.log("Fetched Report Data:", data); // Log the API response for debugging
        setReportData(data || {}); // Fallback to an empty object if the response is null
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Failed to load report data. Please try again.");
      }
    };

    fetchReports();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    console.log("Updated Filters:", { ...filters, [name]: value }); // Log filter changes
  };

  const handleDownload = async (format) => {
    try {
      await downloadReport(format, filters);
      console.log(`Report downloaded in ${format} format`);
    } catch (err) {
      console.error("Error downloading report:", err);
      setError(`Failed to download ${format.toUpperCase()} report. Please try again.`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Reporting and Analytics</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters Section */}
      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Company</Form.Label>
          <Form.Control
            type="text"
            name="company"
            value={filters.company}
            onChange={handleInputChange}
            placeholder="Enter company name"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date Range</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
            />
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Communication Method</Form.Label>
          <Form.Select
            name="method"
            value={filters.method}
            onChange={handleInputChange}
          >
            <option value="">All Methods</option>
            <option value="LinkedIn Post">LinkedIn Post</option>
            <option value="Email">Email</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>
      </Form>

      {/* Charts Section */}
      <div className="mb-4">
        <h4>Communication Frequency</h4>
        <Bar
          data={{
            labels: reportData.methods.length ? reportData.methods : ["No data"],
            datasets: [
              {
                label: "Frequency",
                data: reportData.methodCounts.length ? reportData.methodCounts : [0],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>

      <div className="mb-4">
        <h4>Engagement Effectiveness</h4>
        <Pie
          data={{
            labels: reportData.methods.length ? reportData.methods : ["No data"],
            datasets: [
              {
                label: "Effectiveness",
                data: reportData.methodEffectiveness.length
                  ? reportData.methodEffectiveness
                  : [0],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>

      <div className="mb-4">
        <h4>Overdue Communication Trends</h4>
        <Line
          data={{
            labels: reportData.trendDates.length ? reportData.trendDates : ["No data"],
            datasets: [
              {
                label: "Overdue Communications",
                data: reportData.trendCounts.length ? reportData.trendCounts : [0],
                fill: false,
                borderColor: "#FF5733",
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>

      {/* Activity Log */}
      <div className="mb-4">
        <h4>Real-Time Activity Log</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Company</th>
              <th>Method</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {activityLog.length ? (
              activityLog.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{log.user || "Unknown"}</td>
                  <td>{log.company || "Unknown"}</td>
                  <td>{log.method || "Unknown"}</td>
                  <td>{log.notes || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No activity log data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Download Reports */}
      <div className="mb-4">
        <Button variant="primary" onClick={() => handleDownload("pdf")}>
          Download PDF
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => handleDownload("csv")}>
          Download CSV
        </Button>
      </div>
    </div>
  );
}

export default ReportingDashboard;
