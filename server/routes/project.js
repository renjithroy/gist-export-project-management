const express = require("express");
const router = express.Router();

const project = require("../controllers/project");

// CREATE PROJECT | GET PROJECTS
router.route("/")
    .get(project.getProjects)
    .post(project.createProject)

// GET SINGLE PROJECT | UPDATE PROJECT | DELETE PROJECT
router.route("/:id")
    .get(project.getProject)
    .put(project.updateProject)
    .delete(project.deleteProject)

module.exports = router;