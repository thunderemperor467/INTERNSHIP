const mongoose = require("mongoose");

const excelFileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExcelFile", excelFileSchema);