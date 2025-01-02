const API_URL = process.env.NODE_ENV === "production"
  ? "https://cal-app-bknd-smoky.vercel.app"
  : "http://localhost:5000";

const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${url}`, options);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
};

// Companies
export const fetchCompanies = async () => {
  return await handleFetch("/api/companies");
};

export const saveCompany = async (company) => {
  return await handleFetch("/api/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  });
};

export const deleteCompany = async (id) => {
  await handleFetch(`/api/companies/${id}`, { method: "DELETE" });
};

// Communications
export const fetchCommunications = async () => {
  return await handleFetch("/api/communications");
};

export const logCommunication = async (comm) => {
  return await handleFetch("/api/communications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comm),
  });
};

export const deleteCommunication = async (id) => {
  await handleFetch(`/api/communications/${id}`, { method: "DELETE" });
};

// Communication Methods
export const fetchMethods = async () => {
  return await handleFetch("/api/communication-methods");
};

export const saveMethod = async (method) => {
  return await handleFetch("/api/communication-methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(method),
  });
};

export const deleteMethod = async (id) => {
  await handleFetch(`/api/communication-methods/${id}`, { method: "DELETE" });
};

// Reports
export const fetchReportData = async (filters) => {
  return await handleFetch("/api/reports/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
};

export const downloadReport = async (format, filters) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/download`, {
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