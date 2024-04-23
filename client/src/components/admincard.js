import "./top.css";
export const Admincard = (props) => {
  return (
    <div className="col-4 d-flex justify-content-center align-items-center">
      <div
        className={props.class}
        style={{
          width: "80%",
          borderRadius: "5px",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i className="fa fa-users" style={{ marginRight: "15px" }}></i>
        <p
          className="vertical-line"
          style={{ marginLeft: "15px", marginBottom: "0" }}
        >
          <span style={{ marginLeft: "15px" }}>
            {"Number of " + props.dept}
            <br />
            <span style={{ fontWeight: "bolder",marginLeft: "15px"  }}>{props.number}</span>
          </span>
        </p>
      </div>
    </div>
  );
};
