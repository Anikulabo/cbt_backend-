import "./top.css";
export const Admincard = (props) => {
  return (
    <div className="card transparent-div col-4">
      <i className="fa fa-users"></i>
      <p className="vertical-line"></p>
      <span>
        {"Number of " + props.dept}
        <br />
        <span style={{ fontWeight: "bolder" }}>{props.number}</span>
      </span>
    </div>
  );
};
