import React from "react";
import CompanyManagement from "./CompanyManagement";
import MethodManagement from "./MethodManagement";

function AdminModule() {
  return (
    <div className="container mt-4">
      <h2>Admin Module</h2>
      <CompanyManagement />
      <MethodManagement />
    </div>
  );
}

export default AdminModule;
