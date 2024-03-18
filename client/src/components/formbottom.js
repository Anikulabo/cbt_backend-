import "./top.css";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { updatemessage } from "../action";
 export const Rightbottom = () => {
  const dispatch=useDispatch();
  const name1 = useSelector((state) => state.items.name);
  const password = useSelector((state) => state.items.password);
  const score = useSelector((state) => state.items.score);
  const status = useSelector((state) => state.items.score);
  const save = async (event, name, score, password, status) => {
    event.preventDefault();
    if (password !== "") {
      try {
        const response=await axios.post("http:/api/users", {
          username: name,
          password: password,
          status: status,
          score: score,
        });
        console.log(response.data);
        dispatch("success",response.data);
      } catch (error) {
          dispatch(updatemessage("warning",error))
      }
    }else{
      dispatch(updatemessage("warmimg","you can't submit a emppty password"))
    }
  };
  return (
    <div style={{ position: "absolute", bottom: "30px" }}>
      <button
        className="text-light bg-lemon formb"
        style={{ position: "relative", left: "0" }}
      >
        <i className="fa fa-upload" />
        <span style={{ marginLeft: "10px" }}>Upload a photo</span>
      </button>
      <button
        className="text-light bg-lemon formb"
        style={{
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <i className="fa fa-camera" />
        <span style={{ marginLeft: "10px" }}>Take a photo</span>
      </button>
      <button
        className="text-light bg-lemon formb"
        style={{ position: "relative", left: "70%" }}
        onClick={(event) => {
          save(event,name1,score,password,status);
        }}
      >
        <i className="fa fa-paper-plane" />
        <span style={{ marginLeft: "10px" }}>Register</span>
      </button>
    </div>
  );
};
