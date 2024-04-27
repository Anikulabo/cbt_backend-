import React from "react";
import unaabImage from "./unaab.jpeg"; // Importing the image
import { useNavigate } from 'react-router-dom';
import { Adminwelcome, Admincard, PieChart } from "./components";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
export const Admin = () => {
  const name = useSelector((state) => state.items.biodata.username);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users");
        if (response.status >= 200 && response.status < 300) {
          const jsonData = await response.data;
          setData(jsonData);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data initially when component mounts
    fetchData();

    // Fetch data every two seconds
    const intervalId = setInterval(fetchData, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
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
          className="col-2 bg-dark text-light"
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
          <div className="mt-4">
            <button
              className="btn btn-outline-light btn-block mb-2"
            >
              Upload questions
            </button><br/>
            <Link to="/registration">
            <button
              className="btn btn-outline-light btn-block mb-2"
            >
              Register a student
            </button>
            </Link>
            <br/>
            <button
              className="btn btn-outline-light btn-block mb-2"
            >
              Button 3
            </button>
          </div>
        </div>

        <div className="col-10" style={{ minHeight: "100vh" }}>
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
            <div className="row">
              <PieChart data={pieChartData} tabledata={data}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
