const express = require("express");
const userroutes = express.Router();
const {
  loginuser,
  cbtlogin,
  viewuser,
} = require("../controllers/userscontroller");
const {generateToken,typechecker}=require("./authorization")
const {
    generalauthentication,
    adminauthentication
  } = require("./authorization");
  const loginWithDependencies = (req, res) => {
    loginuser(req, res,{typechecker,generateToken});
  };
  userroutes.post('/',loginWithDependencies);
  userroutes.get('/cbt',cbtlogin);
  userroutes.get('/:id/:searchrole',adminauthentication,viewuser);
  module.exports = userroutes;