const express = require("express");
const classroutes = express.Router();
const {
  addclass,
  editclass,
  viewclasses,
} = require("../controllers/classcontrollers");
const {
    generalauthentication,
    adminauthentication
  } = require("../controllers/jwtgeneration");
classroutes.post("/",adminauthentication,addclass);
classroutes.get("/:id",adminauthentication,viewclasses);
classroutes.put("/:id",adminauthentication,editclass);
