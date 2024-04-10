import {
  Forms,
  Rightbottom,
  Top,
  Inputpassword,
  Textinput,
  Button
} from "./components";
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { rootReducer } from "./reducer";
import { createStore } from "redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/top.css";
import exam4 from "./components/img/exam4.jpg";
import exam5 from "./components/img/exam5.jpg";
import exam6 from "./components/img/exam6.jpg";
import exam7 from "./components/img/exam7.jpg";
export const store = createStore(rootReducer);
function Login() {
  const [index, setIndex] = useState(0);
  const images = [exam4, exam5, exam6,exam7];
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

  return (
    <div className="container-fluid h-100" style={{ overflowY: "auto" }}>
      <div className="row h-100">
        <div className="col-5 d-flex align-items-stretch" style={leftHalfStyle}>
          <div style={redHueStyle}></div>
          {/* Content for the left half */}
        </div>
        <div className="col-7 formholder d-flex align-items-stretch">
          <Provider store={store}>
            <Top content={"Log in"} />
            <Forms>
              <Textinput
                variable={"UserName"}
                //data={datas.username}
                placeholder={"enter your Username"}
                //actions={{ changeVariable: changeVariablef }}
              />
              <Inputpassword
                variable={"Password"}
                //type={password2}
                placeholder={"type your password"}
                // value={pass2}
                // eyeicon={eyeicon2}
                // control={"password2"}
                // iconcontrolled={2}
                // actions={{
                //   changeVariable: changeVariablef,
                //   hideIcon: hideIconf,
                //   changeType: changeTypef,
                // }}
              />
            </Forms>
            <Rightbottom>
              <Rightbottom>
                <Button
                  content="Login"
                   class="fas fa-sign-in-alt"
                  // action={save}
                  position="690%"
                />
              </Rightbottom>
            </Rightbottom>
          </Provider>
        </div>
      </div>
    </div>
  );
}
export default Login;
