import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">📊 Excel Analytics</h1>
      <div className="space-x-6">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/upload" className="hover:text-blue-400">Upload</Link>
        <Link to="/charts" className="hover:text-blue-400">Charts</Link>
        <button onClick={logout} className="hover:text-red-400">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;