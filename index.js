const express=require('express');
const path=require('path');
const multer  = require('multer');
const upload = multer(); // 
const {createQuestion,getQuestions,updateQuestion,deleteQuestion}=require("./controllers/questionscontroller.js")
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  loginuser
} = require('./controllers/userscontroller.js');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client','build')));
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, 'client/build/index.html'))
})
;
app.get('/api/users',getUsers);
app.post('/api/users',upload.single('image'),createUser);
app.put('/api/users/:id',updateUser);
app.delete('/api/users/:id',deleteUser);
app.post('/api/questions',createQuestion);
app.put('/api/questions/:id',updateQuestion)
app.post("/api/login",loginuser)
app.listen(3001, () => {
  console.log("Server listening in http://localhost:3001");
});
