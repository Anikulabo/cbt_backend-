import React from "react";
import unaabImage from "./unaab.jpeg"; // Importing the image
import { Adminwelcome, Admincard,PieChart } from "./components";
import { useSelector } from "react-redux";
export const Admin = () => {
  const name = useSelector((state) => state.items.biodata.username);
  const pieChartData = {
    science: {
      labels: ["Excellent", "Average", "Poor"],
      values: [20, 57, 23],
    },
    art: {
      labels: ["Excellent", "Average", "Poor"],
      values: [10, 25, 65],
    },
    commercial: {
      labels: ["Excellent", "Average", "Poor"],
      values: [34, 38, 28],
    },
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-3 bg-dark text-light"
          style={{ minHeight: "100vh" }}
        >
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
          <Adminwelcome name={name} />
          <hr />
          <div className="container-fluid" style={{ marginTop: "15px" }}>
            <div className="row">
              <Admincard class="transparent-red" dept="science" number={100} />
              <Admincard class="transparent-green" dept="art" number={200} />
              <Admincard
                class="transparent-blue"
                dept="commercial"
                number={300}
              />
            </div>
          </div>
           <PieChart data={pieChartData}/>
        </div>
      </div>
    </div>
  );
};
