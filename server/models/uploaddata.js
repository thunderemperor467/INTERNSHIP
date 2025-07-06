const mongoose = require("mongoose");

const uploadDataSchema = new mongoose.Schema({
  data: Object,
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "ExcelFile" },
});

module.exports = mongoose.model("UploadData", uploadDataSchema);
