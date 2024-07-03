// Example seed.js

const { sequelize } = require("../models");
const Class = require("../models/class");
async function seed() {
  try {
    await sequelize.sync({ force: true }); // Drop existing tables and re-create them (for development only)

    // Seed data
    await Class.bulkCreate([
      { year: 1, category_id: 3, department_id: 0,name:'jss 1',teacherid:0 },
      { year: 2, category_id: 3, department_id: 0,name:'jss 2',teacherid:0 },
      { year: 1, category_id: 2, department_id: 0,name:'basic 1',teacherid:0 },
      { year: 6, category_id: 2, department_id: 0,name:'basic 6',teacherid:0 },
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
