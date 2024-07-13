const  Notifications  = require("../models/notification");
const express = require("express");
const notificationroutes = express.Router();

notificationroutes.post("/", async (req, res) => {
  const { activity_id, to, type } = req.body;
  const expectedKeys = ["activity_id", "to", "type"];

  // Check for missing keys
  for (const key of expectedKeys) {
    if (!req.body.hasOwnProperty(key)) {
      return res.status(400).json({ error: `Key ${key} is missing` });
    }
    if (typeof req.body[key] !== "number") {
      return res.status(400).json({ error: `Key ${key} should be a number` });
    }
  }

  // Check for unexpected keys
  for (const key in req.body) {
    if (!expectedKeys.includes(key)) {
      return res
        .status(400)
        .json({ error: `Key ${key} is not an expected key` });
    }
  }

  try {
    await Notifications.create({ activity_id, to, type });
    return res.status(201).json({ message: "Notification added successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server is down for now" });
  }
});

module.exports = notificationroutes;
