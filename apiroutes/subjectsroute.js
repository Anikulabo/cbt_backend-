const express = require("express");
const bodyParser = require("body-parser");
const subjectsroutes = express.Router();
const Registration = require("../models/registration");
const Subjects = require("../models/subjects");
const Sessions = require("../models/session");
const Categories = require("../models/categories");
const Activities=require('../models/activities');
const Notifications=require('../models/notification')
const Registeredcourses = require("../models/registeredcourses.");
const {io,typechecker}=require('../controllers/jwtgeneration');
const { notifyauser } = require("../controllers/sessioncontrollers");
const { addsubject, viewsubject } = require("../controllers/subjectcontroller");
const {
  adminauthentication,
  generalauthentication,
} = require("./authorization");
const { sequelize } = require("../models");
const multer = require("multer");
subjectsroutes.use(bodyParser.json());
subjectsroutes.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});
const addsubjectWithDependencies = (req, res) => {
  const models = {
     Subjects,
   Categories,
    Notifications,
    Activities,
     sequelize,
  };
  addsubject(req, res, { models,io,notifyauser,typechecker });
};
const viewsubjectWithDependencies = (req, res) => {
  const models = { sequelize, Registeredcourses, Registration, Sessions };
  viewsubject(req, res, { models });
};
subjectsroutes.post('/',adminauthentication,upload.single("file"),addsubjectWithDependencies);
subjectsroutes.get('/:cate_id/:teacherid',generalauthentication,viewsubjectWithDependencies)
module.exports = subjectsroutes;