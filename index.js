const express=require('express')
const { Sequelize, DataTypes } = require('sequelize');
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require('./path/to/your/module/file');
const sequelize = new Sequelize("exam", "root", "", {
    dialect: "mysql",
    host: "localhost",
    port: 3306,
  });
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi");
});
app.get('/users',getUsers);

app.post('/users',createUser);
app.put('/users/:id',updateUser);
app.delete('/users/:id',deleteUser);

app.listen(5000, () => {
  console.log("Server listening in http://localhost:5000");
});
