import avatar from "./img/Avatart1.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
export const Students = () => {
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
  if (data) {
    return (
      <div
        className="table-responsive"
        style={{ maxHeight: "350px", overflowY: "auto" }}
      >
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Image</th>
              <th>Username</th>
              <th>Department</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((info, index) => {
              return (
                <tr key={index}>
                  {" "}
                  <td>
                    <img
                      src={avatar}
                      alt="User Image"
                      className="img-fluid"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{info.username}</td>
                  <td>{info.department}</td>
                  <td>{info.subject}</td>
                  <td>{info.status}</td>
                  <td>
                    <button className="btn btn-primary">
                      Return to Pending
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <img
                  src={avatar}
                  alt="User Image"
                  className="img-fluid"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "50%",
                  }}
                />
              </td>
              <td>John Doe</td>
              <td>Science</td>
              <td>Mathematics</td>
              <td>Active</td>
              <td>
                <button className="btn btn-primary">Return to Pending</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    return "there is no data for now";
  }
};
