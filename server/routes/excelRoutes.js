// server/routes/excelRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/auth");
const {
  uploadExcel,
  getColumns,
  getFileDetails,
  plotExcelData,
  getStats,
  analyzeExcelFile,
} = require("../controllers/excelController");

// Multer in‑memory storage
const upload = multer({ storage: multer.memoryStorage() });

/* ─── Routes ────────────────────────────────────────────── */
router.post("/upload", verifyToken, upload.single("file"), uploadExcel);
router.get("/columns", verifyToken, getColumns);
router.get("/fileDetails", verifyToken, getFileDetails);
router.get("/plot", verifyToken, plotExcelData);
router.get("/stats", verifyToken, getStats);      // optional dashboard card
router.get("/analyze", verifyToken, analyzeExcelFile);

module.exports = router;
