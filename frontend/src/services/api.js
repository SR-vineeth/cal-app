const API_URL = "http://localhost:5000/api";

// Helper function to handle fetch requests
const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
};

// Fetch all companies
export const fetchCompanies = async () => {
  return await handleFetch(`${API_URL}/companies`);
};

// Save a new company
export const saveCompany = async (company) => {
  return await handleFetch(`${API_URL}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  });
};

// Delete a company by ID
export const deleteCompany = async (id) => {
  await handleFetch(`${API_URL}/companies/${id}`, { method: "DELETE" });
};

// Fetch all communications
export const fetchCommunications = async () => {
  return await handleFetch(`${API_URL}/communications`);
};

// Log a new communication
export const logCommunication = async (comm) => {
  return await handleFetch(`${API_URL}/communications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comm),
  });
};

// Fetch all communication methods
export const fetchMethods = async () => {
  return await handleFetch(`${API_URL}/communication-methods`);
};

// Save a new communication method
export const saveMethod = async (method) => {
  return await handleFetch(`${API_URL}/communication-methods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(method),
  });
};

// Delete a communication method by ID
export const deleteMethod = async (id) => {
  await handleFetch(`${API_URL}/communication-methods/${id}`, { method: "DELETE" });
};

// Fetch report data with filters
export const fetchReportData = async (filters) => {
  return await handleFetch(`${API_URL}/reports/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
};
export const deleteCommunication = async (id) => {
  const res = await fetch(`${API_URL}/communications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete communication");
};

// Download a report in a specific format (PDF or CSV)
export const downloadReport = async (format, filters) => {
  try {
    const response = await fetch(`${API_URL}/reports/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, ...filters }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error(`Error downloading report: ${error.message}`);
    throw error;
  }
};
