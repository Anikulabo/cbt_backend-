import "./top.css";
import { Option } from "./option";
import { CameraComponent } from "./lifefeed";
import { Bottom } from "./subbottom";
import { Easynavigator } from "./Navtab";
import { useEffect, useState } from "react";
export const Main = ({
  question,
  number,
  actions,
  bottombtn,
  nav,
  displayctrl,
  answers,
  user,
  total,
  time
}) => {
  const [avatarSrc, setAvatarSrc] = useState(null);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
  let options = [
    question.option_a,
    question.option_b,
    question.option_c,
    question.option_d,
  ];
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Dynamically import avatar based on user's username
        const avatar = await import("./img/" + user.username + ".jpg").catch(
          () => import("./img/Avatart1.jpg")
        );
        setAvatarSrc(avatar.default);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, [user.username]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md-2"
          style={{
            borderRight: "0.5px solid gray",
            borderBottom: "0.5px solid gray",
            minHeight: "88vh",
          }}
        >
          <button className="btn btn-light greenborder text-lemon">
            <i className="fas fa-book" style={{ marginRight: "15px" }}></i>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              Subjects
            </span>
          </button>
          <button className="btn btn-light greenborder text-light bg-lemon">
            <i className="fas fa-tv" style={{ marginRight: "15px" }}></i>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              Exam
            </span>
          </button>
          <button className="btn btn-light greenborder text-lemon">
            <i className="far fa-user" style={{ marginRight: "15px" }}></i>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              {user.department}
            </span>
          </button>
          <div className="user bg-lemon text-light">
            <img
              src={avatarSrc}
              alt="it should show an avatar"
              height="50%"
              width="50%"
              style={{
                alignSelf: "center",
                borderRadius: "50%",
                border: "2.5px solid white",
              }}
              className="mt-3"
            />
            <div style={{ fontWeight: "bolder", textTransform: "capitalize" }}>
              {user.username}
            </div>
            <div style={{ marginBottom: "15px", textTransform: "capitalize" }}>
              {user.username + "22@gmail.com"}
            </div>
          </div>
        </div>
        <div className="col-md-10">
          <div
            className="container text-lemon mt-3"
            style={{ fontWeight: "bolder" }}
          >
            <span>{"Exam/" + user.activity.subject}</span>
            <span style={{ marginLeft: "80%" }}>{formatTime(time)}</span>
          </div>
          <div
            className="container"
            style={{
              height: "80vh",
              border: "0.5px solid rgb(81, 194, 37)",
              borderRadius: "8px",
            }}
          >
            <div className="container-fluid">
              <div className="row">
                <div
                  className="col-md-8"
                  style={{
                    height: "80vh",
                    borderRight: "1px solid rgb(81, 194, 37)",
                    position: "relative", // Ensure proper positioning of the Bottom component
                  }}
                >
                  {/* Question content */}
                  <div className="text-dark" style={{ fontWeight: "bolder" }}>
                    {" "}
                    {"Question " + (number + 1)}
                  </div>
                  <div>{question.question}</div>
                  <Option
                    options={options}
                    no={question.id}
                    save={actions.save}
                    answer={answers}
                  />
                  <Easynavigator
                    num={number}
                    show={nav}
                    answered={answers}
                    action={actions.move}
                  />
                  {/* Bottom component */}
                  <Bottom
                    number={number}
                    action={actions.move}
                    btndisplay={bottombtn}
                    ctrl={displayctrl}
                  />
                </div>
                <div className="col-md-4 d-flex justify-content-center">
                  <CameraComponent time={time} total={total} answers={answers} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
