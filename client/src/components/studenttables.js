import avatar from "./img/Avatart1.jpg";
import axios from "axios";
export const Students = (props) => {
  const toretake = async (event) => {
    const buttonId = event.target.id;
    try {
      const data = {
        score: 0,
        status: "pending",
      };
      const response = await axios.put(
        "http://localhost:3001/api/scores/" + buttonId,
        data
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  if (props.data) {
    return (
      <div
        className="table-responsive"
        style={{ maxHeight: "350px", overflowY: "auto" }}
      >
        <h5 className="card-title">{props.title}</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              {props.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.map((info, index) => {
              return (
                <tr key={index}>
                  {" "}
                  <td>
                    <img
                      src={avatar}
                      alt="User Image"
                      className="img-fluid"
                      style={{
                        maxWidth: "50px",
                        maxHeight: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{info.username}</td>
                  <td>{info.department}</td>
                  <td>{info.subject}</td>
                  <td>{info.status}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      id={info.id}
                      onClick={(event) => toretake(event)}
                    >
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
                    maxWidth: "50px",
                    maxHeight: "50px",
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
