import { Forms, Rightbottom, Top } from "./components";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/top.css";
import axios from "axios";
import exam2 from "./components/img/exam2.jpg";
import exam1 from "./components/img/exam1.jpg";
import exam3 from "./components/img/exam3.jpg";
import { Textinput } from "./components/inputtext";
import { Inputpassword } from "./components/inputpassword";
import { Button } from "./components/Button";
import {
  handleUploadPhoto,
  updatemessage,
  destroy,
  changeVariable,
  changeType,
  hideIcon,
} from "./action";
const formdata = new FormData();
function BackgroundChanger() {
  const dispatch = useDispatch();
  const changeTypef = (which) => {
    dispatch(changeType(which));
  };
  const hideIconf = (where, length) => {
    dispatch(hideIcon(where, length));
  };
  const updatemessagef = (part, message) => {
    dispatch(updatemessage(part, message));
  };
  const destroyf = () => {
    dispatch(destroy());
  };
  const changeVariablef = (name, type) => {
    dispatch(changeVariable(name, type));
  };
  const [index, setIndex] = useState(0);
  const images = [exam1, exam2, exam3];
  const datas = useSelector((state) => state.items.biodata);
  const error = useSelector((state) => state.items.error);
  let img = useSelector((state) => state.items.img);
  let small = useSelector((state) => state.items.warning.signup);
  let pass1 = useSelector((state) => state.items.password1);
  let pass2 = useSelector((state) => state.items.password2);
  let password1 = useSelector((state) => state.items.type1);
  let eyeicon1 = useSelector((state) => state.items.eyeicon1);
  let eyeicon2 = useSelector((state) => state.items.eyeicon2);
  let password2 = useSelector((state) => state.items.type2);
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
  const save = async (event) => {
    event.preventDefault();
    let nodata = [];
    for (let key in datas) {
      if (
        (typeof datas[key] === "string" && datas[key].trim() === "") ||
        datas[key] === null
      ) {
        nodata.push(`${key}`);
      }
    }
    if (nodata.length >= 1) {
      updatemessagef(
        "signup-warning",
        "you.ve to fill in your " + nodata + " before you can register"
      );
    } else {
      formdata.append("username", datas.username);
      formdata.append("password", datas.password);
      formdata.append("image", datas.image);
      formdata.append("department", datas.department);
      try {
        const response = await axios.post(
          "http://localhost:3001/api/users",
          formdata
        );
        console.log("Success:", response.data);
      } catch (error) {
        if (error.response.status >= 500) {
          console.log(error)
          updatemessagef(
            "warning",
            error
          );
        }
      }
    }
  };
  const upload = (event) => {
    alert(
      "Please upload your own photo. Using someone else's photo may have consequences. "
    );
    // Display an alert to inform the user
    // Access the file input element to trigger file selection
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".jpeg, .jpg, .png, .gif"; // Allow specified image file types
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const image = file;
          const shownimage = e.target.result;
          dispatch(handleUploadPhoto(image, shownimage));
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click(); // Trigger the file input click event
  };
  return (
    <div className="container-fluid h-100" style={{ overflowY: "auto" }}>
      <div className="row h-100">
        <div className="col-5 d-flex align-items-stretch" style={leftHalfStyle}>
          <div style={redHueStyle}></div>
          {/* Content for the left half */}
        </div>
        <div className="col-7 formholder d-flex align-items-stretch">
          <Top content={"Sign up"} />
          <Forms  error={error} small={small}>
            <Textinput
              variable={"UserName"}
              data={datas.username}
              placeholder={"enter your username"}
              actions={{ changeVariable: changeVariablef }}
            />
            <Inputpassword
              variable={"Password"}
              type={password1}
              placeholder={"input your surname as password"}
              value={pass1}
              eyeicon={eyeicon1}
              control={"password1"}
              iconcontrolled={1}
              actions={{
                changeVariable: changeVariablef,
                hideIcon: hideIconf,
                changeType: changeTypef,
              }}
            />
            <Inputpassword
              variable={""}
              type={password2}
              placeholder={"re-type your password"}
              value={pass2}
              eyeicon={eyeicon2}
              control={"password2"}
              iconcontrolled={2}
              actions={{
                changeVariable: changeVariablef,
                hideIcon: hideIconf,
                changeType: changeTypef,
              }}
            />
            <Textinput
              variable={"Department"}
              data={datas.department}
              placeholder={"enter your department"}
              actions={{ changeVariable: changeVariablef }}
            />
            <div style={{ marginTop: "50px", marginLeft: "0" }}>
              <img
                src={img}
                height={"100px"}
                width={"300px"}
                style={{ borderRadius: "5px", marginBottom: "50px" }}
                alt={"your selected or photoshot comes here"}
              />
            </div>
          </Forms>
          <Rightbottom>
            <Button
              content="Upload a photo"
              class="fa fa-upload"
              action={upload}
              style={{
                position: "relative",
                left: "0",
              }}
            />
            <Button
              content="Take a photo"
              class="fa fa-camera"
              style={{
                position: "relative",
                left: "50%",
              }}
            />
            <Button
              content="Register"
              class="fa fa-paper-plane"
              action={save}
              style={{
                position: "relative",
                left: "90%",
              }}
            />
          </Rightbottom>
        </div>
      </div>
    </div>
  );
}
export default BackgroundChanger;
