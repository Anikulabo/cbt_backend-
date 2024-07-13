const express = require("express");
const registrationroutes = express.Router();
const {
  register,
  viewregister,
  updateregister,
} = require("../controllers/registrationcontrollers");
const {
  assignClass,
  notifyallparties,
} = require("../controllers/jwtgeneration");
const Registration = require("../models/registration");
const Subjects = require("../models/subjects");
const Sessions = require("../models/session");
const Categories = require("../models/categories");
const Activities = require("../models/activities");
const Registeredcourses = require("../models/registeredcourses.");
const { adminauthentication,generalauthentication } = require("./authorization");
const { sequelize } = require("../models");
const models = {
  Categories: Categories,
  Subjects: Subjects,
  Sessions: Sessions,
  Registration: Registration,
  Activities: Activities,
  sequelize: sequelize,
};
const registerWithDependencies = (req, res) => {
  register(req, res, { assignClass, notifyallparties, models });
};
const viewRegisterWithDependencies = (req, res) => {
  const models = {
    Registration:Registration,
    Subjects:Subjects,
    Registeredcourses:Registeredcourses,
    Sessions:Sessions,
    sequelize:sequelize,
  };
  viewregister(req, res,models);
};
// Register a student (accessible to admins only)
registrationroutes.post("/", adminauthentication, registerWithDependencies);

// Update registration (accessible to admins only)
//registrationroutes.put("/:id", adminauthentication, updateregister);

// View registration details (accessible to general/all users)
registrationroutes.get("/:class_id/:subject_id", generalauthentication, viewRegisterWithDependencies);

module.exports = registrationroutes;
