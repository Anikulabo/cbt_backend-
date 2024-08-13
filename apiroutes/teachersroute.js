const express = require("express");
const bodyParser = require("body-parser");
const teachersroute = express.Router();
const {
  generalauthentication,
  adminauthentication,
} = require("./authorization");
const {
  addteacher,
  updateteacher,
} = require("../controllers/teacherscontrollers");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});
// Use body-parser middleware
teachersroute.use(bodyParser.json());
teachersroute.use(bodyParser.urlencoded({ extended: true }));

// Routes
teachersroute.post("/", adminauthentication, upload.single("file"), addteacher);
teachersroute.put("/:id", updateteacher);

module.exports = teachersroute;
