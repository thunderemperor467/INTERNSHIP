const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/upload", require("./uploadRoutes")); // ✅ Add this line

module.exports = router;
