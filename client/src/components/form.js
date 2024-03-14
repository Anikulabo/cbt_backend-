import "./top.css";
import { sendPassword,sendName } from "../action";
import { useDispatch,useSelector } from "react-redux";
export const Forms = () => {
   let dispatch=useDispatch();
   let small=useSelector((state)=>state.items.warning)
   return (
    <form className="container-fluid">
     <div style={{marginTop:"50px" ,marginLeft:"0"}}>
      UserName <br />
      <input
        type="text"
        className="data"
        placeholder="enter your username"
        onChange={(event)=>dispatch(sendName(event.target.value))}
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
      <small className="text-danger" style={{display:"block"?small:"none"}}>both passwords must be equal before you can register</small>
      </div>
    </form>
  );
};
