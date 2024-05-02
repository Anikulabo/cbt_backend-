import "./test.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Welcome, Main } from "./components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import backgroundImage from "./unaab.jpeg";
import { changenum, shownav, updateAnswered} from "./action";
function Test(props) {
  let num = useSelector((state) => state.items.number);
  let tabledisplay = useSelector((state) => state.items.showtable);
  let answered = useSelector((state) => state.items.answered);
  let data = useSelector((state) => state.items.biodata);
  let questions=data.activity.questions;
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

    if (num === questions.length - 1) {
      setBtndisplay((prevDisplay) => ({ ...prevDisplay, next: "none" }));
    } else {
      setBtndisplay((prevDisplay) => ({ ...prevDisplay, next: "block" }));
    }
  }, [num, questions.length]);
  let dispatch = useDispatch();
  const move = (event) => {
    if (!isNaN(event.target.innerHTML)) {
      dispatch(changenum(num, event.target.innerHTML, questions.length));
    }
    if (parseInt(event.target.innerHTML) > questions.length) {
      alert("You have exceeded the total number of questions.");
    } else {
      const buttonText = event.target.innerHTML.trim().toLowerCase();
      if (buttonText === "next") {
        dispatch(changenum(num, "add", questions.length));
      } else if (buttonText === "previous") {
        dispatch(changenum(num, "subtract", questions.length));
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
        question={questions[num]}
        number={num}
        actions={{ move: move, save: save }}
        bottombtn={btndisplay}
        nav={tabledisplay}
        displayctrl={shide}
        answers={answered}
        user={data}
      />
    </div>
  );
}
export default Test;