const express = require("express");
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
const addsubjectWithDependencies = (req, res) => {
  const models = {
    Subjects: Subjects,
    Categories: Categories,
    Notifications:Notifications,
    Activities:Activities,
    sequelize: sequelize,
  };
  addsubject(req, res, { models,io,notifyauser,typechecker });
};
const viewsubjectWithDependencies = (req, res) => {
  const models = { sequelize, Registeredcourses, Registration, Sessions };
  viewsubject(req, res, { models });
};
subjectsroutes.post('/',adminauthentication,addsubjectWithDependencies);
subjectsroutes.get('/:cate_id/:teacherid',generalauthentication,viewsubjectWithDependencies)
module.exports = subjectsroutes;