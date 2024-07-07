const jwt = require("jsonwebtoken");
const jwtSecretKey=process.env.JWT_SECRET_KEY||"KELVIN"
exports.adminauthentication = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    jwt.verify(token.split(" ")[1], jwtSecretKey, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
  
      if (payload.role !== 1) {
        return res
          .status(403)
          .json({ error: "you are not authorized to view this data" });
      }
      req.user = payload;
      next();
    });
  };
  exports.generalauthentication = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token.split(" ")[1], jwtSecretKey, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = payload;
      next();
    });
  };