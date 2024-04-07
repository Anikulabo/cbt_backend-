import "./top.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updatemessage, destroy, upload } from "../action";
const formdata = new FormData();
export const Rightbottom = () => {
  const dispatch = useDispatch();
  const datas = useSelector((state) => state.items.biodata);
  const error = useSelector((state) => state.items.error);
  const handleUploadPhoto = () => {
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
          dispatch(upload(file, e.target.result));
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click(); // Trigger the file input click event
  };
  const save = async (data, event) => {
    event.preventDefault();
    let nodata = [];
    for (let key in data) {
      if (
        (typeof data[key] === "string" && data[key].trim() === "") ||
        data[key] === null
      ) {
        nodata.push(`${key}`);
      }
    }
    if (nodata.length >= 1) {
      dispatch(
        updatemessage(
          "warning",
          "you.ve to fill in your " + nodata + " before you can register"
        )
      );
    } else {
      formdata.append("username", data.username);
      formdata.append("password", data.password);
      formdata.append("image", data.image);
      formdata.append("department", data.department);
      try {
        const response = await axios.post("http://localhost:3001/api/users", formdata);
        console.log("Success:", response.data);
      } catch (error) {
        if(error.response.status>=500){
          dispatch(updatemessage("warning","there is a server error or the user is not unique"))
        }
      }
    }
  };
  return (
    <div style={{ position: "absolute", bottom: "10px" }}>
      <button
        className="text-light bg-lemon formb"
        style={{ position: "relative", left: "0" }}
        onClick={() => {
          alert(
            "Please upload your own photo. Using someone else's photo may have consequences."
          );
          handleUploadPhoto();
        }}
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
          save(datas, event);
        }}
      >
        <i className="fa fa-paper-plane" />
        <span style={{ marginLeft: "10px" }}>Register</span>
      </button>
    </div>
  );
};
