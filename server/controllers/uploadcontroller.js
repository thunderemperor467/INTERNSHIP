// server/controllers/uploadController.js
const xlsx = require("xlsx");
const ExcelFile = require("../models/ExcelFile");
const UploadData = require("../models/uploaddata");

exports.uploadExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const savedFile = await ExcelFile.create({
      filename: file.filename,
      originalname: file.originalname,
    });

    const entries = data.map((item) => ({ data: item, fileId: savedFile._id }));
    await UploadData.insertMany(entries);

    res.json({ msg: "File uploaded successfully", rowCount: data.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed to parse Excel", error: err.message });
  }
};
