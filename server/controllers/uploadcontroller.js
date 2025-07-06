const XLSX = require("xlsx");
const UploadData = require("../models/uploaddata.js");

const handleExcelUpload = async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const upload = new UploadData({
      uploadedBy: req.user.id,
      filename: req.file.originalname,
      rows: data,
    });

    await upload.save();

    res.status(201).json({
      message: "File uploaded and saved successfully",
      totalRows: data.length,
      uploadId: upload._id
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to process file", error: err.message });
  }
};

module.exports = { handleExcelUpload };
