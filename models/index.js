const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Read all files in the current directory (models directory)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Exclude hidden files
      file !== basename && // Exclude this index.js file
      file.slice(-3) === ".js" && // Filter only .js files
      file.indexOf(".test.js") === -1 // Exclude test files if any
    );
  })
  .forEach((file) => {
    // Require the model file to get the constructor
    try {
      const model = require(path.join(__dirname, file));
      // Invoke the constructor with sequelize and DataTypes to define the model
      //const modelInstance = new model(sequelize, Sequelize.DataTypes);
     // console.log(`Model loaded: ${model.name}`);
      db[model.name] = model;      // Assign the model instance to the db object with its name as key
    } catch (error) {
      console.error(`Error loading model from file ${file}:`, error);
    }
  });

// Establish associations if defined in the models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// Export the sequelize instance and models (assuming you have some)
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object containing all models and sequelize instance
module.exports = db;
