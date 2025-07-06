const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/upload", require("./uploadRoutes"));
router.use("/excel", require("./excelRoutes"));

module.exports = router;
