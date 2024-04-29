import React from "react";
import unaabImage from "./unaab.jpeg"; // Importing the image
import {
  Adminwelcome,
  Admincard,
  PieChart,
  Questionupload,
} from "./components";
import { changeVariable } from "./action";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
export const Admin = () => {
  const name = useSelector((state) => state.items.biodata.username);
  const activity = useSelector((state) => state.items.activity);
  const [duration, setDuration] = useState("min");
  const [after, setAfter] = useState(1);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState({
    frontend: false,
    backend: false,
  });
  const dispatch = useDispatch();
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const check = () => {
    alert(
      "the nexk subject will be " +
        activity.subject +
        " for " +
        activity.dept +
        " giving a duration of " +
        activity.time
    );
  };
  const settime = (event) => {
    setDuration(event.target.value);
  };
  const updateactivity = (event, type) => {
    let time = Number(event.target.value);
    if (isNaN(time)) {
      dispatch(changeVariable(event.target.value, type));
    } else {
      if (duration === "min") {
        time = 60 * time;
        dispatch(changeVariable(time, type));
      }
      if (duration === "hour") {
        time = 3600 * time;
        dispatch(changeVariable(time, type));
      }
    }
  };
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("name", activity.subject);
      formData.append("department", activity.dept);
      formData.append("timeAllocated", activity.time);
      formData.append("attempt", after);
      formData.append("file", file); // Assuming 'file' is the file object

      const response = await axios.post(
        "http://localhost:3001/api/questions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from backend:", response.data.message);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const modalctrl = (type) => {
    if (type === "open") {
      setShowModal({ ...showModal, frontend: true });
    } else {
      setShowModal({ ...showModal, frontend: false });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users", {
          subject: activity.subject,
        });
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
      <Questionupload
        showModal={showModal.frontend}
        actions={{
          control: modalctrl,
          handleFileChange: handleFileChange,
          handleUpload: handleUpload,
          updateactivity: updateactivity,
          settime: settime,
          check: check,
        }}
      />
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
              onClick={() => modalctrl("open")}
              className="btn btn-outline-light btn-block mb-2"
            >
              Upload questions
            </button>
            <br />
            <Link to="/registration">
              <button className="btn btn-outline-light btn-block mb-2">
                Register a student
              </button>
            </Link>
            <br />
            <button className="btn btn-outline-light btn-block mb-2">
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
              <PieChart data={pieChartData} tabledata={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
