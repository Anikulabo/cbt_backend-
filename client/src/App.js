import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Welcome, Main } from "./components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changenum, shownav, updateAnswered } from "./action";
function App(props) {
  let num = useSelector((state) => state.items.number);
  let tabledisplay = useSelector((state) => state.items.showtable);
  let answered = useSelector((state) => state.items.answered);
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
    <div className="All">
      <Welcome />
      <Main
        question={props.questions[num]}
        number={num}
        actions={{ move: move, save: save }}
        bottombtn={btndisplay}
        nav={tabledisplay}
        displayctrl={shide}
        answers={answered}
      />
    </div>
  );
}

export default App;
