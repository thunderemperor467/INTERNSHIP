const mongoose = require("mongoose");

const uploadDataSchema = new mongoose.Schema({
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  rows: [mongoose.Schema.Types.Mixed],
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UploadData", uploadDataSchema);
