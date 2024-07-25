const { typechecker, generateToken } = require("../controllers/jwtgeneration");
const createToken = async (req, res) => {
  const { userid, username, role } = req.body;
  try {
    let result = generateToken({ userid, username, role },{typechecker});
    return res.status(200).json({ token: result });
  } catch (error) {
    console.error("error:", error);
    return res
      .status(500)
      .json({ message: "an error occured during token generation" });
  }
};
module.exports = createToken;
