import {
  Forms,
  Rightbottom,
  Top,
  Inputpassword,
  Textinput,
  Button,
} from "./components";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { rootReducer } from "./reducer";
import { createStore } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { changeType, changeVariable, hideIcon, updatemessage } from "./action";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/top.css";
import exam4 from "./components/img/exam4.jpg";
import exam5 from "./components/img/exam5.jpg";
import exam6 from "./components/img/exam6.jpg";
import exam7 from "./components/img/exam7.jpg";
import axios from "axios";
export const store = createStore(rootReducer);
function Login() {
  const navigate=useNavigate()
  const [index, setIndex] = useState(0);
  const images = [exam4, exam5, exam6, exam7];
  const dispatch = useDispatch();
  const datas = useSelector((state) => state.items.biodata);
  const eyeicon = useSelector((state) => state.items.eyeicon1);
  const password = useSelector((state) => state.items.type1);
  const warning = useSelector((state) => state.items.warning.login);
  const error = useSelector((state) => state.items.error);
  const changeVariablef = (name, type) => dispatch(changeVariable(name, type));
  const hideIconf = (where, length) => dispatch(hideIcon(where, length));
  const changeTypef = (which) => dispatch(changeType(which));
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const leftHalfStyle = {
    height: "100vh",
    backgroundImage: `url(${images[index]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  };

  const redHueStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
  };
  const handleLogin = async (event) => {
    if (datas.password.length > 0 && datas.username.length > 0) {
      const username = datas.username;
      const password = datas.password;
      try {
        const response = await axios.post("http://localhost:3001/api/login", {
          username,
          password,
        });
        console.log(response.data.userdata.department);
       if(response.data.userdata.department!=="admin"){
        navigate("/test"
        ,{replace:true})
       } 
        else{
          navigate("/admin",{replace:true})
        }
      } catch (error) {
        console.error("Error logging in:", error.response.data);
        dispatch(updatemessage("login-warning", error.response.data));  
      }
    } else {
      dispatch(updatemessage("login-warning", "input your username and password"));
    }
  };
  return (
    <div className="container-fluid h-100" style={{ overflowY: "auto" }}>
      <div className="row h-100">
        <div className="col-6 d-flex align-items-stretch" style={leftHalfStyle}>
          <div style={redHueStyle}></div>
          {/* Content for the left half */}
        </div>
        <div className="col-6 formholder d-flex align-items-stretch">
          <Provider store={store}>
            <Top content={"Log in"} />
            <Forms small={warning} error={error}>
              <Textinput
                variable={"UserName"}
                data={datas.username}
                placeholder={"enter your Username"}
                actions={{ changeVariable: changeVariablef }}
              />
              <Inputpassword
                variable={"Password"}
                type={password}
                placeholder={"type your password"}
                value={datas.password}
                eyeicon={eyeicon}
                control={"password"}
                iconcontrolled={1}
                actions={{
                  changeVariable: changeVariablef,
                  hideIcon: hideIconf,
                  changeType: changeTypef,
                }}
              />
            </Forms>
            <Rightbottom>
              <Button
                content="Login"
                class="fas fa-sign-in-alt"
                style={{
                  position: "relative",
                  left: "590%",
                  display: "flex",
                  alignItems: "center",
                }}
                action={handleLogin}
              />
            </Rightbottom>
          </Provider>
        </div>
      </div>
    </div>
  );
}
export default Login;