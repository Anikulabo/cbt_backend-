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
  exports.typechecker = (incomingobject, expectedkeys) => {
    // An array to accept the good keys
    const goodkeys = [];
  
    // Check if expectedkeys is an array
    if (!Array.isArray(expectedkeys)) {
      throw new Error(
        "The second parameter should be an array of objects with key-value pairs of 'key' and 'type'."
      );
    }
  
    // Check for any abnormalities in the expectedkeys array
    const abnormality = expectedkeys.find(
      (detail) =>
        !detail.key ||
        !detail.type ||
        (typeof detail.type !== "string" && !Array.isArray(detail.type))
    );
    if (abnormality) {
      throw new Error(
        `Abnormal key: ${JSON.stringify(
          abnormality
        )}. We need an array of objects with keys ['key', 'type'] as the second parameter, and both key and type must be strings.`
      );
    }
  
    // Check if incomingobject is a valid object
    if (
      typeof incomingobject !== "object" ||
      incomingobject === null ||
      Array.isArray(incomingobject)
    ) {
      throw new Error(
        `The first parameter should be a non null object, but you provided a ${typeof incomingobject} or a null object.`
      );
    }
  
    // Iterate over the keys and values of the incoming object
    for (const [key, value] of Object.entries(incomingobject)) {
      const match = expectedkeys.find((element) => element.key === key);
  
      // Check if the key exists in the expected keys
      if (!match) {
        throw new Error(`Your incoming object has an unexpected key: ${key}.`);
      }
  
      // Validate the type of the value
      if (match.type !== "array" && match.type !== typeof value) {
        throw new Error(
          `Expected a ${
            match.type
          } for key ${key} in the first parameter, but received a ${typeof value}.`
        );
      }
  
      // Special handling for array type
      if (match.type === "array" && !Array.isArray(value)) {
        throw new Error(
          `Expected an array for key ${key} in the incoming object, but received a ${typeof value}.`
        );
      }
      if (value === null) {
        throw new Error(
          `expected ${match.type} in key ${key} of the first parameter but you gave a null value`
        );
      }
      // Handle cases where 'type' is an array of acceptable types
      if (Array.isArray(match.type) && !match.type.includes(typeof value)) {
        throw new Error(
          `Expected one of [${match.type.join(
            ", "
          )}] for key ${key}, but received ${typeof value}.`
        );
      }
  
      // If all checks pass, add the key to the good keys array
      goodkeys.push(key);
    }
  
    // Check for any missing keys
    const missingkeys = expectedkeys
      .map((detail) => detail.key)
      .filter((key) => !goodkeys.includes(key));
    if (missingkeys.length > 0) {
      throw new Error(`You are missing keys [${missingkeys.join(", ")}].`);
    }
  
    return goodkeys;
  };
  exports.generateToken = (mainpayload, { typechecker }) => {
    const { userid, username, role } = mainpayload;
    try {
      // Use typechecker to validate the payload
      typechecker({ userid, username, role }, [
        { key: "userid", type: "number" },
        { key: "username", type: "string" },
        { key: "role", type: "number" }, // Assuming role is a string, update if necessary
      ]);
  
      // Ensure JWT secret key is available
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      if (!jwtSecretKey) {
        throw new Error(
          "JWT_SECRET_KEY is not defined in the environment variables."
        );
      }
  
      // Define expiration and payload
      const expiration = "1h";
      const payload = { userid, username, role };
  
      // Generate the JWT token
      const token = jwt.sign(payload, jwtSecretKey, { expiresIn: expiration });
      return token;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred during token generation");
    }
  };
  /*function createUploadMiddleware(externalUploadDir) {
    // Ensure the directory exists
    console.log("saving image");
    if (!fs.existsSync(externalUploadDir)) {
      fs.mkdirSync(externalUploadDir, { recursive: true });
    }
  
    // Set up multer
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, externalUploadDir); // Use the external directory
      },
      filename: function (req, file, cb) {
        const staffId = req.body.staff_id || "default";
        cb(null, `${staffId}${path.extname(file.originalname)}`);
      },
    });
  
    return multer({
      storage: storage,
      limits: { fileSize: 1000000 }, // Limit file size to 1MB
      fileFilter: function (req, file, cb) {
        // Allowed file types
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);
  
        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb("Error: Images Only!");
        }
      },
    }).single("image"); // 'image' is the field name in the form
  }
  module.exports = createUploadMiddleware*/;