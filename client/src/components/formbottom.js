import "./top.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updatemessage, destroy } from "../action";
export const Rightbottom = () => {
  const dispatch = useDispatch();
  const name1 = useSelector((state) => state.items.name);
  const password = useSelector((state) => state.items.password);
  const score = useSelector((state) => state.items.score);
  const error=useSelector((state)=>state.items.error);
  const status = useSelector((state) => state.items.score);
  const handleUploadPhoto = () => {
    // Display an alert to inform the user
    alert("Please upload your own photo. Using someone else's photo may have consequences.");
    
    // Access the file input element to trigger file selection
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.jpeg, .jpg, .png, .gif'; // Allow specified image file types
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Check if the file is an image
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Image loaded successfully, proceed with further processing
            // Set the file name to the user's username
            const fileName = `${name1}.${file.name.split('.').pop().toLowerCase()}`;
            // Here you can further process the file (e.g., upload to a server)
            // For demonstration, I'm just logging the file name
            console.log("Selected file name:", fileName);
          };
          img.onerror = () => {
            // Not an image, show error message
            alert("Please upload a valid image file.");
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file); // Read file as data URL
      }
    };
    fileInput.click(); // Trigger the file input click event
  };
  const save = async (event, name, score, password, status) => {
    event.preventDefault();
    if (password !== "") {
      try {
        const response = await axios.post("http://localhost:3001/api/users", {
          username: name,
          password: password,
          status: status,
          score: score,
        });
         dispatch(destroy());
        alert(response.data.message)
        console.log(response.data.message);
      } catch (error) {
        dispatch(updatemessage("warning", error));
      }
    } else {
      dispatch(updatemessage("warning", "you can't submit a emppty password"));
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
          save(event, name1, score, password, status);
        }}
      >
        <i className="fa fa-paper-plane" />
        <span style={{ marginLeft: "10px" }}>Register</span>
      </button>
    </div>
  );
};
