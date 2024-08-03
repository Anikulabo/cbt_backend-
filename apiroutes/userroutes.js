const express = require("express");
const userroutes = express.Router();
const {
  loginuser,
  cbtlogin,
  viewuser,
} = require("../controllers/userscontroller");
const {
    generalauthentication,
    adminauthentication
  } = require("../controllers/jwtgeneration");
  userroutes.post('/',loginuser);
  userroutes.get('/cbt',cbtlogin);
  userroutes.get('/:id/:searchrole',adminauthentication,viewuser);
  module.exports = userroutes;