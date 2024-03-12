import "./top.css";
import avatar1 from "./img/Avatart1.jpg";
import { Option } from "./option";
import { CameraComponent } from "./lifefeed";
import { Bottom } from "./subbottom";
import { Easynavigator } from "./Navtab";
export const Main = ({ question, number, actions, bottombtn,nav,displayctrl,answers }) => {
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
            <i className="fas fa-list" style={{ marginRight: "15px" }}></i>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              Dashboard
            </span>
          </button>
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
              User Info
            </span>
          </button>
          <div className="user bg-lemon text-light">
            <img
              src={avatar1}
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
            <div style={{ fontWeight: "bolder" }}>Olamide Bello</div>
            <div style={{ marginBottom: "15px" }}>Bello22@gmail.com</div>
          </div>
        </div>
        <div className="col-md-10">
          <div
            className="container text-lemon mt-3"
            style={{ fontWeight: "bolder" }}
          >
            <span>Exam/Subject</span>
            <span style={{ marginLeft: "80%" }}>42:30:54</span>
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
                  <Option options={question.options} no={question.id} save={actions.save} answer={answers}/>
                   <Easynavigator num={number} show={nav} answered={answers} action={actions.move}/>
                  {/* Bottom component */}
                  <Bottom
                    number={number}
                    action={actions.move}
                    btndisplay={bottombtn}
                    ctrl={displayctrl}
                  />
                </div>
                <div className="col-md-4 d-flex justify-content-center">
                  <CameraComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
