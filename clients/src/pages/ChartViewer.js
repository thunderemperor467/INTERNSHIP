import React, { useState, useEffect, useMemo } from "react";
import {
  Scatter as ScatterChart,
  Bar as BarChart,
  Line as LineChart,
  Pie as PieChart,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  registerables,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AxisPicker from "../components/AxisPicker";

ChartJS.register(...registerables, LinearScale, PointElement, Tooltip, Legend);

const API = "http://localhost:5000/api";
const palette = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#fb923c", "#f472b6", "#14b8a6", "#eab308"];

export default function ChartViewer() {
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [plotData, setPlotData] = useState([]);
  const [chartType, setChartType] = useState("Scatter");
  const [analysis, setAnalysis] = useState("");
  const [err, setErr] = useState("");
  const [loadingPlot, setLoadingPlot] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [dotSize, setDotSize] = useState(4);
  const [fileInfo, setFileInfo] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: token };
    Promise.all([
      fetch(`${API}/excel/columns`, { headers }),
      fetch(`${API}/excel/fileDetails`, { headers }),
    ])
      .then(async ([colRes, fileRes]) => {
        if (!colRes.ok) throw new Error("Failed to load column list");
        if (!fileRes.ok) throw new Error("Failed to load file details");
        const [colData, fileData] = await Promise.all([
          colRes.json(),
          fileRes.json(),
        ]);
        setColumns(colData);
        setFileInfo(fileData);
        setErr("");
      })
      .catch(() => setErr("⚠️ Failed to initialise Chart Viewer."));
  }, [token]);

  const fetchPlot = () => {
    setErr("");
    setAnalysis("");
    setPlotData([]);

    if (!xAxis || !yAxis) {
      setErr("❌ Please select at least X and Y axes.");
      return;
    }

    setLoadingPlot(true);
    const headers = { Authorization: token };
    const url = `${API}/excel/plot?x=${encodeURIComponent(xAxis)}&y=${encodeURIComponent(yAxis)}&z=${encodeURIComponent(zAxis)}`;

    fetch(url, { headers })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.msg || "Failed to fetch plot data");
        }
        return res.json();
      })
      .then((data) => {
        if (!data?.length) {
          setErr("🚫 No numeric rows found for the selected columns.");
        } else {
          setPlotData(data);
        }
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoadingPlot(false));
  };

  const handleAnalyze = async () => {
    if (!fileInfo?._id) {
      setErr("No file uploaded to analyse.");
      return;
    }
    setErr("");
    setAnalysis("");
    setLoadingAnalysis(true);

    try {
      const res = await fetch(`${API}/excel/analyze?fileId=${fileInfo._id}`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) setAnalysis(data.analysis);
      else setErr(data.msg || "Failed to analyse Excel file.");
    } catch {
      setErr("🌐 Network/server error during analysis.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const { genericData, scatterData } = useMemo(() => {
    const labels = plotData.map((p) => `${p[xAxis] ?? p.x}`);
    const values = plotData.map((p) => p[yAxis] ?? p.y);

    return {
      genericData: {
        labels,
        datasets: [
          {
            label: `${yAxis} vs ${xAxis}`,
            data: values,
            borderWidth: 1,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          },
        ],
      },
      scatterData: {
        datasets: [
          {
            label: `${xAxis} vs ${yAxis}`,
            data: plotData.map((p) => ({ x: p.x, y: p.y })),
            backgroundColor: bgColor,
            pointRadius: dotSize,
          },
        ],
      },
    };
  }, [plotData, xAxis, yAxis, bgColor, dotSize]);

  const render3DScatter = () => (
    <Canvas className="w-full h-[400px] rounded-xl shadow-inner bg-slate-100 dark:bg-slate-800">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {plotData.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z || 0]}>
          <sphereGeometry args={[dotSize / 10, 16, 16]} />
          <meshStandardMaterial color={bgColor} />
        </mesh>
      ))}
      <OrbitControls />
    </Canvas>
  );

  const render2DScatter = () => (
    <ScatterChart data={scatterData} options={{ responsive: true }} />
  );

  const renderGenericChart = () => {
    const props = {
      data: genericData,
      options: { responsive: true },
    };
    switch (chartType) {
      case "Line": return <LineChart {...props} />;
      case "Bar": return <BarChart {...props} />;
      case "Pie": return <PieChart {...props} />;
      default: return null;
    }
  };

  const renderChart = () => {
    if (!plotData.length) return null;
    if (chartType === "Scatter") {
      return zAxis && plotData[0].z !== undefined ? render3DScatter() : render2DScatter();
    }
    return renderGenericChart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-300 dark:to-purple-400 drop-shadow mb-10">
          📊 Data Visualization Playground
        </h1>

        {fileInfo && (
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-900 dark:text-blue-100 p-4 rounded-xl mb-6 text-sm shadow-inner">
            <p>📄 File: <strong>{fileInfo.originalname}</strong></p>
            <p>📈 Rows: <strong>{fileInfo.totalRows}</strong></p>
            <p>📊 Columns: <strong>{fileInfo.columnCount}</strong></p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <AxisPicker columns={columns} axis={xAxis} setAxis={setXAxis} />
          <AxisPicker columns={columns} axis={yAxis} setAxis={setYAxis} />
          <AxisPicker columns={columns} axis={zAxis} setAxis={setZAxis} />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg shadow hover:ring-2 ring-blue-500 transition"
          >
            <option value="Scatter">Scatter / 3D</option>
            <option value="Line">Line</option>
            <option value="Bar">Bar</option>
            <option value="Pie">Pie</option>
          </select>

          <button
            onClick={fetchPlot}
            disabled={loadingPlot}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition hover:scale-105 disabled:opacity-50"
          >
            {loadingPlot ? "⏳ Plotting..." : "📌 Plot Chart"}
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loadingAnalysis}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition hover:scale-105 disabled:opacity-50"
          >
            {loadingAnalysis ? "🧠 Analyzing..." : "🧠 AI Analyze"}
          </button>
        </div>

        {err && (
          <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-xl mb-6 shadow">
            {err}
          </div>
        )}

        {analysis && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm whitespace-pre-wrap shadow-inner">
            <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">🧠 AI Analysis:</h3>
            <pre>{analysis}</pre>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}



