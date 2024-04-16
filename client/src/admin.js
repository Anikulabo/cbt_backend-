import React from "react";
import unaabImage from "./unaab.jpeg"; // Importing the image
export const Admin = () => {
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
                fff,
              }}
            />
            <span style={{ marginLeft: "15px", marginTop: "15px" }}>
              FUNAAB
            </span>
          </div>
        </div>
        <div className="col-9" style={{ minHeight: "100vh" }}>
          <div className="row" style={{ position: "absolute", top: "10px" }}>
            <div className="col-9 text-dark" style={{ fontWeight: "bolder" }}>
              Dashboard
            </div>
            <div className="col-3">
              <i className="fa fa-bel"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
