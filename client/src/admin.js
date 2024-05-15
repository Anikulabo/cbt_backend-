import React from "react";
import unaabImage from "./unaab.jpeg"; // Importing the image
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Adminwelcome,
  Admincard,
  PieChart,
  Questionupload,
  WatermarkTable,
} from "./components";
import { changeVariable } from "./action";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
export const Admin = () => {
  const name = useSelector((state) => state.items.biodata.username);
  const activity = useSelector((state) => state.items.biodata.activity);
  const dept = useSelector((state) => state.items.biodata.department);
  const [duration, setDuration] = useState("min");
  const [after, setAfter] = useState(1);
  const [notification, setNotification] = useState([]);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [results, setResults] = useState({ result: "", dept: "", subject: "" });
  const [showModal, setShowModal] = useState({
    subjectview: false,
    backend: false,
    resultview: false,
    resulttable: false,
  });
  const dispatch = useDispatch();
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
        time = 100 * time;
        dispatch(changeVariable(time, type));
      }
      if (duration === "hour") {
        time = 10000 * time;
        dispatch(changeVariable(time, type));
      }
    }
  };
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("name", activity.subject);
      formData.append("department", dept);
      formData.append("timeAllocated", activity.time);
      formData.append("attempt", after);
      formData.append("file", file);
      const response = await axios.post(
        "http://localhost:3001/api/questions",
        formData
      );
      console.log("Response from backend:", response.data.message);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const modalctrl = (type) => {
    if (type === "viewopen") {
      setShowModal({ ...showModal, subjectview: true });
    }
    if (type === "viewclose") {
      setShowModal({ ...showModal, subjectview: false });
    }
    if (type === "resultsopen") {
      setShowModal({ ...showModal, resultview: true });
    }
    if (type === "resultsclose") {
      setShowModal({ ...showModal, resultview: false });
    }
    if (type === "tableopen") {
      setShowModal({ ...showModal, resulttable: true });
    }
    if (type === "tableclose") {
      setShowModal({ ...showModal, resulttable: false });
    }
  };
  const downloadPdf = async() => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgHeight = (canvas.height * 208) / canvas.width;
      pdf.addImage(imgData, 0, 0, 208, imgHeight);
      pdf.save("download.pdf");
    });
  };
  const viewresult = async (event) => {
    const all = event.target.id.split("/");
    const dept = all[0];
    try {
      const results = await axios.get(
        `http://localhost:3001/api/scores/${dept}`
      );
      if (results.status === 200) {
        setResults({ result: results.data, dept: dept, subject: all[1] });
        console.log(results.data);
        modalctrl("tableopen");
        modalctrl("resultsclose");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "http://localhost:3001/api/users"
        );
        let depts = [];
        let notifications = [];

        if (usersResponse.status >= 200 && usersResponse.status < 300) {
          const usersData = await usersResponse.data;

          for (const data of usersData) {
            if (depts.indexOf(data.department) < 0) {
              depts.push(data.department);
            }
          }

          setData(usersData);

          for (const dept of depts) {
            const downloadResponse = await axios.get(
              `http://localhost:3001/api/download/${dept}`
            );

            if (downloadResponse.status === 201) {
              notifications.push({
                dept: dept,
                message: downloadResponse.data.message,
                subject: downloadResponse.data.subject,
              });
            }

            setNotification(notifications);
          }
        } else {
          throw new Error("Failed to fetch users data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data initially when component mounts
    fetchData();

    // Fetch data every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount

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
      {notification && (
        <Questionupload
          showModal={showModal.resultview}
          actions={{ control: modalctrl }}
          title="Notifications"
          footer={{
            close: "close",
            mainfunction: "upload",
            modalcontrolled: "results",
          }}
        >
          {notification.map((content, index) => (
            <div key={index}>
              {content.message}
              <button
                id={content.dept + "/" + content.subject}
                className="btn btn-primary"
                onClick={(event) => viewresult(event)}
              >
                view
              </button>
            </div>
          ))}
        </Questionupload>
      )}
      <Questionupload
        showModal={showModal.resulttable}
        actions={{ control: modalctrl }}
        title="download result"
        footer={{
          close: "close",
          modalcontrolled: "table",
        }}
      >
        {results.result && (
          <WatermarkTable
            data={results.result}
            subject={results.subject}
            dept={results.dept}
          />
        )}
      </Questionupload>
      <Questionupload
        showModal={showModal.subjectview}
        actions={{
          control: modalctrl,
          mainfunction: handleUpload,
        }}
        footer={{
          close: "close",
          mainfunction: "upload",
          modalcontrolled: "view",
        }}
        title="Upload a Word document"
      >
        <input
          type="text"
          placeholder="name of subject"
          className="container-fluid"
          onChange={(event) => updateactivity(event, "adminsubject")}
        />
        <br />
        <input
          type="text"
          placeholder="department taking the subject"
          className="container-fluid mt-3"
          onChange={(event) => updateactivity(event, "Department")}
        />
        <br />
        <div>
          <input
            className="mt-3"
            type="number"
            style={{ width: "10%" }}
            onChange={(event) => updateactivity(event, "admintime")}
          />
          <select className="mt-3" style={{ width: "30%" }}>
            <option
              value="min"
              style={{ padding: "5px" }}
              onClick={(event) => settime(event)}
            >
              Minutes
            </option>
            <option
              value="hour"
              style={{ padding: "5px" }}
              onClick={(event) => settime(event)}
            >
              Hours
            </option>
          </select>
        </div>
        <input
          className="mt-3"
          type="file"
          onChange={(event) => handleFileChange(event)}
        />
      </Questionupload>
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
              onClick={() => modalctrl("viewopen")}
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
          <Adminwelcome
            name={name}
            shownotification={modalctrl}
            notifications={notification}
          />
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
