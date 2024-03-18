export const save = async (event, name, score, password, status) => {
  event.preventDefault();
  if(password!=="")
  {
    try {
      await axios.post("http:127.0.0.1:3001/api/users", {
        username: name,
        password: password,
        status: status,
        score: score,
      });
    } catch (error) {}
  }
};
