import "./test.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Welcome, Main } from "./components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import backgroundImage from "./unaab.jpeg";
import { changenum, shownav, updateAnswered, updatemessage } from "./action";
function Test(props) {
  let num = useSelector((state) => state.items.number);
  let tabledisplay = useSelector((state) => state.items.showtable);
  let answered = useSelector((state) => state.items.answered);
  let data = useSelector((state) => state.items.biodata);
  let message = useSelector((state) => state.items.camerastatus.message);
  let status = useSelector((state) => state.items.camerastatus.status);
  const [btndisplay, setBtndisplay] = useState({
    next: "block",
    previous: "none",
  });
  useEffect(() => {
    if (num > 0) {
      setBtndisplay((prevDisplay) => ({ ...prevDisplay, previous: "block" }));
    } else {
      setBtndisplay((prevDisplay) => ({ ...prevDisplay, previous: "none" }));
    }

    if (num === props.questions.length - 1) {
      setBtndisplay((prevDisplay) => ({ ...prevDisplay, next: "none" }));
    } else {
      setBtndisplay((prevDisplay) => ({ ...prevDisplay, next: "block" }));
    }
  }, [num, props.questions.length]);
  let dispatch = useDispatch();
  const calculateBrightness = (imageBitmap) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    context.drawImage(imageBitmap, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let brightness = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      brightness +=
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    }
    return brightness / (imageData.data.length / 4);
  };
  const checkBrightness = (stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    const check = async () => {
      try {
        const imageBitmap = await imageCapture.grabFrame();
        const brightness = calculateBrightness(imageBitmap);
        if (brightness < 100) {
          dispatch(
            updatemessage("camerafailure", "Room is not bright enough!")
          );
        } else {
          dispatch(
            updatemessage("camerasuccess", "we're can now see you clearly")
          );
        }
        setTimeout(check, 1000); // Check brightness every second
      } catch (error) {
        console.error("Error grabbing frame:", error);
      }
    };

    check();
  };
  const move = (event) => {
    if (!isNaN(event.target.innerHTML)) {
      dispatch(changenum(num, event.target.innerHTML, props.questions.length));
    }
    if (parseInt(event.target.innerHTML) > props.questions.length) {
      alert("You have exceeded the total number of questions.");
    } else {
      const buttonText = event.target.innerHTML.trim().toLowerCase();
      if (buttonText === "next") {
        dispatch(changenum(num, "add", props.questions.length));
      } else if (buttonText === "previous") {
        dispatch(changenum(num, "subtract", props.questions.length));
      }
    }
  };
  const shide = () => {
    dispatch(shownav(tabledisplay));
  };
  const save = (event) => {
    let ansi = event.target.value;
    dispatch(updateAnswered(ansi, num));
  };

  return (
    <div
      className="All"
      style={{
        position: "relative",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.9)),url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "25%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Welcome />
      <Main
        question={props.questions[num]}
        number={num}
        actions={{ move: move, save: save, camera: checkBrightness }}
        bottombtn={btndisplay}
        nav={tabledisplay}
        displayctrl={shide}
        answers={answered}
        user={data}
        camerastatus={status}
        message={message}
      />
    </div>
  );
}
export default Test;
