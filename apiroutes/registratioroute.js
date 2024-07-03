/*const express = require("express");
const registrationroutes = express.Router();
const {
  register,
  viewregister,
  updateregister,
} = require("../controllers/registrationcontrollers");
const {
  generalauthentication,
  adminauthentication,
  assignClass,
  notifyallparties 
} = require("../controllers/jwtgeneration");
const Registration = require("../models/registration");
const Class = require("../models/class");
const registerWithDependencies = (req, res) => {
  register(req, res, { assignClass, notifyallparties });
};
// Register a student (accessible to admins only)
registrationroutes.post("/", adminauthentication, registerWithDependencies);

// Update registration (accessible to admins only)
registrationroutes.put("/:id", adminauthentication, updateregister);

// View registration details (accessible to general/all users)
registrationroutes.get("/:class_id/:subject_id", generalauthentication, viewregister);

module.exports = registrationroutes;*/
