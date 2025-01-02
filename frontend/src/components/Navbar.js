import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/calendar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Calendar
            </Link>
            <Link to="/companies" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Companies
            </Link>
            <Link to="/methods" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Communication Methods
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};