const { register, viewregister,updateregister } = require("./registrationcontrollers");
const {
  adminauthentication,
  generalauthentication,
} = require("./jwtgeneration");

module.exports = {
  register,
  viewregister,
  adminauthentication,
  generalauthentication,
  updateregister
};
