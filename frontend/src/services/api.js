// Set API_URL dynamically based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cal-app-bknd-smoky.vercel.app/api" // Production backend URL
    : "http://localhost:5000/api"; // Local backend URL for development

// Helper function to handle fetch requests
const handleFetch = async (url, options = {}) => {
  try {
    // Use URL object to ensure the URL is correctly combined
    const finalUrl = new URL(url, API_URL); // Combines API_URL with endpoint without double slashes
    const response = await fetch(finalUrl.toString(), options);

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
  return await handleFetch("api/companies"); // No 'api/' needed here
};

// Save a new company
export const saveCompany = async (company) => {
  return await handleFetch("/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  });
};

// Delete a company by ID
export const deleteCompany = async (id) => {
  await handleFetch(`/companies/${id}`, { method: "DELETE" });
};

// Fetch all communications
export const fetchCommunications = async () => {
  return await handleFetch("/communications"); // No 'api/' needed here
};

// Log a new communication
export const logCommunication = async (comm) => {
  return await handleFetch("/communications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comm),
  });
};

// Delete a communication by ID
export const deleteCommunication = async (id) => {
  await handleFetch(`/communications/${id}`, { method: "DELETE" });
};

// Fetch all communication methods
export const fetchMethods = async () => {
  return await handleFetch("/communication-methods"); // No 'api/' needed here
};

// Save a new communication method
export const saveMethod = async (method) => {
  return await handleFetch("/communication-methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(method),
  });
};

// Delete a communication method by ID
export const deleteMethod = async (id) => {
  await handleFetch(`/communication-methods/${id}`, { method: "DELETE" });
};

// Fetch report data with filters
export const fetchReportData = async (filters) => {
  return await handleFetch("/reports/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
};

// Download a report in a specific format (PDF or CSV)
export const downloadReport = async (format, filters) => {
  try {
    const response = await fetch(`${API_URL}/reports/download`, { // Correct path
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
