import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Tooltip, OverlayTrigger } from "react-bootstrap";
import {
  fetchCompanies,
  fetchCommunications,
  deleteCompany,
} from "../../services/api";
import LogCommunicationModal from "./LogCommunicationModal";

function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [highlightOverrides, setHighlightOverrides] = useState({});
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from the server
  const fetchData = async () => {
    const [companiesData, communicationsData] = await Promise.all([
      fetchCompanies(),
      fetchCommunications(),
    ]);
    setCompanies(companiesData);
    setCommunications(communicationsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate highlight color for a company row
  const calculateHighlight = (lastCommunicationDate, companyId) => {
    if (highlightOverrides[companyId]) return ""; // No highlight if overridden

    const now = new Date();
    const lastDate = new Date(lastCommunicationDate);
    const daysDiff = (now - lastDate) / (1000 * 60 * 60 * 24);

    if (daysDiff > 14) return "table-danger"; // Overdue
    if (daysDiff >= 0 && daysDiff < 1) return "table-warning"; // Due today
    return "";
  };

  // Toggle highlight overrides
  const toggleHighlightOverride = (companyId) => {
    setHighlightOverrides((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  // Tooltip for communication notes
  const renderTooltip = (notes) => (
    <Tooltip id="tooltip-notes">{notes || "No notes available"}</Tooltip>
  );

  // Handle company deletion
  const handleDelete = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      await deleteCompany(companyId);
      setCompanies((prev) => prev.filter((company) => company._id !== companyId));
      setCommunications((prev) =>
        prev.filter((comm) => comm.company !== companyId)
      );
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Dashboard</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCompanies(companies.map((c) => c._id));
                  } else {
                    setSelectedCompanies([]);
                  }
                }}
              />
            </th>
            <th>Company Name</th>
            <th>Last Five Communications</th>
            <th>Next Communication</th>
            <th>Actions</th>
            <th>Override Highlights</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company._id}
              className={calculateHighlight(
                company.lastCommunication,
                company._id
              )}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(company._id)}
                  onChange={() => {
                    if (selectedCompanies.includes(company._id)) {
                      setSelectedCompanies((prev) =>
                        prev.filter((id) => id !== company._id)
                      );
                    } else {
                      setSelectedCompanies((prev) => [...prev, company._id]);
                    }
                  }}
                />
              </td>
              <td>{company.name}</td>
              <td>
                {communications
                  .filter((comm) => comm.company === company._id)
                  .slice(0, 5)
                  .map((comm) => (
                    <OverlayTrigger
                      key={comm._id}
                      overlay={renderTooltip(comm.notes)}
                    >
                      <Badge bg="info" className="me-1">
                        {comm.type} - {new Date(comm.date).toLocaleDateString()}
                      </Badge>
                    </OverlayTrigger>
                  ))}
              </td>
              <td>
                {company.nextCommunication
                  ? `${company.nextCommunication.type} - ${new Date(
                      company.nextCommunication.date
                    ).toLocaleDateString()}`
                  : "N/A"}
              </td>
              <td>
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => {
                    setSelectedCompanies([company._id]);
                    setIsModalOpen(true);
                  }}
                >
                  Log Communication
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(company._id)}
                >
                  Delete
                </Button>
              </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => toggleHighlightOverride(company._id)}
                >
                  {highlightOverrides[company._id] ? "Enable" : "Disable"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedCompanies.length > 0 && (
        <Button
          variant="success"
          className="mb-3"
          onClick={() => setIsModalOpen(true)}
        >
          Log Communication for Selected Companies
        </Button>
      )}
      <LogCommunicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companyIds={selectedCompanies}
        onCommunicationLogged={fetchData} // Re-fetch after logging communication
      />
    </div>
  );
}

export default Dashboard;
