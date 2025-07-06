const express = require("express");
const router = express.Router();

const upload = require("../middleware/multerConfig");
const verifyToken = require("../middleware/auth");
const { handleExcelUpload } = require("../controllers/uploadController");

router.post("/", verifyToken, upload.single("file"), handleExcelUpload);

module.exports = router;
