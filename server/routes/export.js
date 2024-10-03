const express = require("express");
const router = express.Router();

const { exportProject } = require("../controllers/export.js");

// EXPORT PROJECT
router.route("/:id")
    .get(exportProject)

module.exports = router;