import "./test.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Welcome, Main } from "./components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./unaab.jpeg";
import { changenum, shownav, updateAnswered, destroy } from "./action";
import axios from "axios";
import { RuleAlert } from "./components";
function Test(props) {
  let num = useSelector((state) => state.items.number);
  let tabledisplay = useSelector((state) => state.items.showtable);
  let answered = useSelector((state) => state.items.answered);
  let data = useSelector((state) => state.items.biodata);
  let questions = data.activity.questions;
  const [testStarted, setTestStarted] = useState(false);
  let time = data.activity.time.split(":");
  let hour = parseInt(time[0]) * 3600;
  let minutes = parseInt(time[1]) * 60;
  let seconds = parseInt(time[2]);
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const [totaltime, setTotaltime] = useState(30);
  const [btndisplay, setBtndisplay] = useState({
    next: "block",
    previous: "none",
  });
  const [showAlert, setShowAlert] = useState(true);
  const handleClose = () => setShowAlert(false);
  const handleStartTest = () => {
    setTestStarted(true);
  };
  const handleTimerComplete = async (ans, guide) => {
    const correctAnswers = ans
      .map((an) => {
        const question = guide.find((item) => item.id === an.id);
        // Check if question is found and the answers match
        if (question && question.correctAnswer === an.answer) {
          return an.answer;
        } else {
          return null; // Explicitly handle cases where the condition is not met
        }
      })
      .filter((answer) => answer !== null);
    const id = data.scoreid;
    const response = await axios.put(`http://localhost:3001/api/scores/${id}`, {
      score: correctAnswers.length,
      status: "done",
      subject: data.activity.subject,
    });
    alert(response.data.message);
    dispatch(destroy());
    navigate("/", { replace: true });
  };
  useEffect(() => {
    if (testStarted) {
      const intervalId = setInterval(() => {
        setTotaltime((prevTotaltime) => {
          if (prevTotaltime > 0) {
            return prevTotaltime - 1;
          } else {
            clearInterval(intervalId); // Clear the interval when the timer reaches 0
            return 0;
          }
        });
      }, 1000);
    }
  }, []);
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
    if (totaltime === 0) {
      handleTimerComplete(answered, questions);
    }
    /*document.addEventListener("visibilitychange", (event) => {
          handleVisibilityChange(event, answers, props.questions,handleTimerComplete,handleCheating);
      });
      const handleBeforeUnload2 = (event,time) => {
       handleBeforeUnload(event,time)
      };
      window.addEventListener("keydown", (event)=>{handleKeyDown(event)});
      window.addEventListener("beforeunload", (event)=>handleBeforeUnload2(event,timeRemaining));
      return () => {
          clearInterval(intervalId);
          window.removeEventListener("keydown", (event)=>{handleKeyDown(event)});
          window.removeEventListener("beforeunload", (event)=>handleBeforeUnload2(event,timeRemaining));
      };
  }*/
  }, [num, answered, questions, totaltime]);
  const move = (event) => {
    alert(data.scoreid);
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
  const save = (event, no) => {
    let ansi = event.target.value;
    dispatch(updateAnswered(ansi, no, num));
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
      <RuleAlert
        showModal={showAlert}
        handleClose={handleClose}
        onStartTest={handleStartTest}
      />
      <Welcome username={data.username} />
      <Main
        question={questions[num]}
        number={num}
        actions={{ move: move, save: save }}
        bottombtn={btndisplay}
        nav={tabledisplay}
        displayctrl={shide}
        answers={answered}
        user={data}
        time={totaltime}
        total={questions.length}
      />
    </div>
  );
}
export default Test;
