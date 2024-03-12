const Sequelize=require('sequelize')
module.exports  = new Sequelize("cbtapp", "root", "", {
    dialect: "mysql",
    host: "localhost",
    port: 3306,
  });