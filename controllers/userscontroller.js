const fs = require("fs");
const { Sequelize } = require("sequelize");
const User = require("../models/users.js");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
exports.createUser = async (req, res) => {
  try {
    const { username, password, department } = req.body;
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    let user = { username, password, department };
    // Check if an image was uploaded
    if (req.file) {
      const imageData = req.file.buffer; // Access file data from req.file.buffer
      const imageName = `${username}.jpg`; // Generate a unique name for the image
      const imagePath = path.join(
        __dirname,
        "../client/src/components/img",
        imageName
      ); // Path to save the image
      // Write the image data to the file
      await writeFileAsync(imagePath, imageData, "base64");

      // Attach the image path to the user object
      user.image = username;
    }

    // Save the user object to the database
    user = await User.create(user);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    // Construct the SQL query
    let query =
      "SELECT users.username, users.department, users.image, scores.subject, scores.status FROM users LEFT JOIN scores ON users.id = scores.user_id where users.department!='admin'";
    // Execute the query
    const results = await User.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT, // specify the query type
    });

    // Send the fetched user data back to the client as JSON
    res.json(results);
  } catch (error) {
    // Handle any errors
    console.error("Error executing query:", error);
    // Send an error response back to the client
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data." });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, status } = req.body;
    await User.update({ username, password, status }, { where: { id } });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.loginuser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && password === user.password) {
      res.json({ userdata: user });
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in,server is down for now");
  }
};
