// clients/src/pages/Home.js

import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // Sample recent uploads (replace later with real API)
  const recentFiles = [
    { name: "Sales_Report.xlsx", uploadedAt: "2 hours ago", id: "1" },
    { name: "Users_Data.xlsx", uploadedAt: "1 day ago", id: "2" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      {/* Top navbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📊 Excel Analytics Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Upload new CTA */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/upload")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow"
        >
          📤 Upload New Excel File
        </button>
      </div>

      {/* Recent files */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📁 Recent Uploads</h2>
        {recentFiles.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentFiles.map((file) => (
              <li key={file.id} className="py-3 flex justify-between">
                <span className="text-gray-800">{file.name}</span>
                <span className="text-gray-500 text-sm">{file.uploadedAt}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent uploads found.</p>
        )}
      </div>

      {/* Chart preview (dummy chart img or react-chartjs later) */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📈 Sample Chart (Coming Soon)</h2>
        <div className="flex justify-center">
          <img
            src="https://www.chartjs.org/media/logo-title.svg"
            alt="Chart Preview"
            className="h-32 opacity-40"
          />
        </div>
      </div>

      {/* Help section */}
      <div className="bg-blue-50 rounded-xl p-6 shadow text-gray-700">
        <h2 className="text-lg font-semibold mb-2">💡 How to Use?</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Click on "Upload New File" to upload Excel (.xlsx) file.</li>
          <li>View parsed data in table or chart format.</li>
          <li>Navigate to Dashboard or Chart Viewer anytime.</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
