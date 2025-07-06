const fs = require("fs");
const xlsx = require("xlsx");
const UploadData = require("../models/uploaddata");
const ExcelFile = require("../models/ExcelFile");

/* ──────────────────────────────
   Helper: Trend detection via slope
────────────────────────────── */
function getTrend(values) {
  const n = values.length;
  if (n < 2) return "not enough data";

  const x = Array.from({ length: n }, (_, i) => i + 1);
  const y = values;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
  const den = x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0);
  const slope = den === 0 ? 0 : num / den;

  if (slope > 0.5) return "increasing";
  if (slope < -0.5) return "decreasing";
  return "stable";
}

/* ──────────────────────────────
   1. Upload and parse Excel file
────────────────────────────── */
exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const wb = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const file = await ExcelFile.create({
      originalname: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    const rows = jsonData.map((data) => ({ data, fileId: file._id }));
    await UploadData.insertMany(rows);

    res.json({ msg: "File uploaded successfully", fileId: file._id });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ msg: "Failed to upload and process Excel file" });
  }
};

/* ──────────────────────────────
   2. Get column names
────────────────────────────── */
exports.getColumns = async (_req, res) => {
  try {
    const doc = await UploadData.findOne();
    if (!doc?.data) return res.status(404).json([]);
    res.json(Object.keys(doc.data));
  } catch {
    res.status(500).json({ msg: "Failed to load columns" });
  }
};

/* ──────────────────────────────
   3. Plot 2D or 3D data
────────────────────────────── */
exports.plotExcelData = async (req, res) => {
  const { x, y, z } = req.query;
  if (!x || !y) return res.status(400).json({ msg: "Missing x or y axis" });

  try {
    const docs = await UploadData.find().limit(100);
    const points = docs
      .map((doc) => {
        const X = Number(doc.data[x]);
        const Y = Number(doc.data[y]);
        const Z = z ? Number(doc.data[z]) : undefined;
        if (!isNaN(X) && !isNaN(Y)) {
          const point = { x: X, y: Y };
          if (z && !isNaN(Z)) point.z = Z;
          return point;
        }
        return null;
      })
      .filter(Boolean);

    res.json(points);
  } catch {
    res.status(500).json({ msg: "Failed to generate plot" });
  }
};

/* ──────────────────────────────
   4. Get file details
────────────────────────────── */
exports.getFileDetails = async (_req, res) => {
  try {
    const firstRow = await UploadData.findOne().populate("fileId");
    const columns = firstRow?.data ? Object.keys(firstRow.data) : [];

    res.json({
      originalname: firstRow?.fileId?.originalname || "Unknown",
      uploadedAt: firstRow?.fileId?.createdAt,
      columns,
      columnCount: columns.length,
      totalRows: await UploadData.countDocuments(),
    });
  } catch {
    res.status(500).json({ msg: "Failed to get file details" });
  }
};

/* ──────────────────────────────
   5. Get dashboard stats
────────────────────────────── */
exports.getStats = async (_req, res) => {
  try {
    const total = await ExcelFile.countDocuments();
    const processed = await UploadData.distinct("fileId");
    res.json({ total, processed: processed.length, failed: 0 });
  } catch {
    res.status(500).json({ msg: "Failed to get stats" });
  }
};

/* ──────────────────────────────
   6. AI‑like trend analysis
────────────────────────────── */
exports.analyzeExcelFile = async (req, res) => {
  try {
    const { fileId } = req.query;
    if (!fileId) return res.status(400).json({ msg: "Missing fileId" });

    const rows = await UploadData.find({ fileId });
    if (!rows.length) return res.status(404).json({ msg: "No data found" });

    const numericCols = {};
    rows.forEach(({ data }) => {
      Object.entries(data).forEach(([key, val]) => {
        const num = Number(val);
        if (!isNaN(num)) {
          if (!numericCols[key]) numericCols[key] = [];
          numericCols[key].push(num);
        }
      });
    });

    const trends = Object.entries(numericCols).map(([col, values]) => {
      const trend = getTrend(values);
      const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
      return `• ${col} is ${trend} (avg: ${avg}, min: ${Math.min(...values)}, max: ${Math.max(...values)})`;
    });

    const result =
      trends.length > 0
        ? `📊 Trend Analysis for file ${fileId}:\n\n${trends.join("\n")}`
        : "No numeric trends could be analyzed.";

    res.json({ analysis: result });
  } catch (err) {
    console.error("❌ Analysis error:", err);
    res.status(500).json({ msg: "Failed to analyze Excel data" });
  }
};
