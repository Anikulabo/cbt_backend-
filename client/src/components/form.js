import "./top.css";
export const Forms = () => {
  return (
    <form className="container-fluid">
     <div style={{marginTop:"50px" ,marginLeft:"0"}}>
      UserName <br />
      <input
        type="text"
        className="data"
        placeholder="enter your username"
             />
      <br />
      </div>
      <div style={{marginTop:"50px",marginLeft:"0"}}>
      password
      <br />
      <input
        type="password"
        className="data"
        placeholder="input a password you can remember"
      />
      <br />
      </div>
      <div style={{marginTop:"50px",marginLeft:"0"}}>
      <input
        type="password"
        className="data"
        placeholder="re-type your password"
      />
      </div>
    </form>
  );
};
