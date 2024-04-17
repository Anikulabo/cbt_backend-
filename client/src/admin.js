import React from "react";
import unaabImage from "./unaab.jpeg"; // Importing the image
import { Adminwelcome } from "./components";
import { useSelector } from "react-redux";
export const Admin = () => {
  const name=useSelector((state)=>state.items.biodata.username)
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-3 bg-dark text-light"
          style={{ minHeight: "100vh" }}
        >
          {/* Displaying the imported image at the top left corner */}
          <div>
            <img
              src={unaabImage}
              alt="UNAAB"
              style={{
                maxHeight: "15%",
                maxWidth: "15%",
                marginTop: "5px",
                borderRadius: "50%",
              }}
            />
            <span style={{ marginLeft: "15px", marginTop: "15px" }}>
              FUNAAB
            </span>
          </div>
        </div>
        <div className="col-9" style={{ minHeight: "100vh" }}>
          <Adminwelcome name={name}/>
        </div>
      </div>
    </div>
  );
};
