// Example seed.js

const { sequelize } = require("../models");
const Sessions = require("../models/session");
async function seed() {
  try {
    await sequelize.sync({ force: true }); // Drop existing tables and re-create them (for development only)

    // Seed data
    await Sessions.bulkCreate([
      { sessionName: "2023/2024", term: "first term", active: false },
      { sessionName: "2023/2024", term: "second term", active: false },
      { sessionName: "2023/2024", term: "third term", active: true },
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
