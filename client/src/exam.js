import { Forms, Rightbottom,Top } from "./components";
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { rootReducer } from "./reducer";
import { createStore } from "redux";
import "bootstrap/dist/css/bootstrap.min.css";
import exam2 from "./components/img/exam2.jpg";
import exam1 from "./components/img/exam1.jpg";
import exam3 from "./components/img/exam3.jpg";
export const store = createStore(rootReducer);
function BackgroundChanger() {
  const [index, setIndex] = useState(0);
  const images = [exam1, exam2, exam3];
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
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
  };

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-6 d-flex align-items-stretch" style={leftHalfStyle}>
          <div style={redHueStyle}></div>
          {/* Content for the left half */}
        </div>
        <div className="col-6 d-flex align-items-stretch">
         <Provider store={store}> 
          <Top/>
          <Forms />
          <Rightbottom />
          </Provider>
        </div>
      </div>
    </div>
  );
}

export default BackgroundChanger;
