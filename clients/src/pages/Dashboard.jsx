import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FileBarChart2,
  UploadCloud,
  BarChart4,
  Info,
  Menu,
  X,
} from "lucide-react";
import api from "../services/api";

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, processed: 0, failed: 0 });
  const [chartData, setChartData] = useState([]);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get("/excel/stats");
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchCharts() {
      try {
        const { data } = await api.get("/excel/chart-data");
        setChartData(data);
      } catch (err) {
        console.error("chart-data error", err);
      }
    }
    fetchCharts();
  }, []);

  const pieData = [
    { name: "Processed", value: stats.processed },
    { name: "Failed", value: stats.failed },
    { name: "Pending", value: stats.total - stats.processed - stats.failed },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            📊 Excel Analytics
          </h2>
          <button onClick={() => setNavOpen(false)} className="md:hidden">
            <X className="w-6 h-6 text-gray-600 dark:text-white" />
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-6 text-gray-700 dark:text-gray-200">
          <a href="#insights" className="hover:text-blue-600">
            🔍 Insights
          </a>
          <a href="#articles" className="hover:text-blue-600">
            📚 Articles & Facts
          </a>
          <a href="#visuals" className="hover:text-blue-600">
            📈 Visualize Data
          </a>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 ml-0 md:ml-64 w-full">
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="absolute top-4 left-4 md:hidden z-50 bg-white dark:bg-gray-800 p-2 rounded-full shadow"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            A quick overview of your uploaded and processed Excel files.
          </p>

          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <KpiCard
              icon={<FileBarChart2 className="w-8 h-8" />}
              label="Total Files"
              value={stats.total}
              bg="bg-blue-100 dark:bg-blue-900"
            />
            <KpiCard
              icon={<UploadCloud className="w-8 h-8" />}
              label="Processed"
              value={stats.processed}
              bg="bg-green-100 dark:bg-green-900"
            />
            <KpiCard
              icon={<BarChart4 className="w-8 h-8" />}
              label="Failed"
              value={stats.failed}
              bg="bg-red-100 dark:bg-red-900"
            />
          </div>

          {/* Insights Section */}
          <div
            id="insights"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-10 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" /> Insights
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                {stats.processed > stats.failed
                  ? "You're doing great! Keep the data clean."
                  : "Check your data sources for inconsistencies."}
              </li>
              <li>Total records analyzed: {stats.total}</li>
              <li>Pending files might need attention or re-upload.</li>
            </ul>
          </div>

          {/* Articles & Facts Section */}
          <div
            id="articles"
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              🧾 Articles & Facts about Excel Analysis
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
              <li>
                <strong>Did you know?</strong> Over 750 million people use Excel
                worldwide.
              </li>
              <li>
                <strong>Best Practice:</strong> Always validate your data before
                uploading.
              </li>
              <li>
                <strong>AI + Excel:</strong> Modern AI tools like GPT can analyze
                your spreadsheets for trends.
              </li>
            </ul>
          </div>

          {/* Visual Data Section */}
          <div
            id="visuals"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-10 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
              📈 Visualize Data
            </h2>

            {chartData.length === 0 ? (
              <p className="text-gray-500">No numeric columns to visualize.</p>
            ) : (
              <div className="w-full h-[400px]">
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, bg }) {
  return (
    <div
      className={`flex items-center gap-4 p-6 rounded-2xl shadow ${bg} text-gray-800 dark:text-white`}
    >
      <div className="p-3 bg-white/40 rounded-full">{icon}</div>
      <div>
        <p className="text-sm uppercase font-medium opacity-70">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
