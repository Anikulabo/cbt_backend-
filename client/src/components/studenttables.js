import avatar from "./img/Avatart1.jpg";
import axios from "axios";
export const Students = (props) => {
  const toretake = async (event) => {
    const buttonId = Number(event.target.id);
    const prevdata = props.data.find(item => item.id === buttonId);
    try {   
      const data = {
        score: 0,
        status: "pending",
        subject:prevdata.subject
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
                      style={{
                        display: info.status === "no exam" ? "none" : "block",
                      }}
                    >
                      Return to Pending
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return "there is no data for now";
  }
};
