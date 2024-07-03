const express = require("express");
const teachersroute = express.Router();
const {
  addteacher,
  viewteachers,
  deleteteachers,
  updateteacher,
} = require("../controllers/teacherscontrollers");
teachersroute.post("/",  addteacher);
teachersroute.put("/:id",updateteacher);
//aroutes opned to  general/all users in general
teachersroute.get("/:category_id/:department_id" , viewteachers);
teachersroute.delete('/:id',deleteteachers);


module.exports = teachersroute;
