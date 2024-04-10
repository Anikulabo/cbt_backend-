import "./top.css";
export const Top = ({content}) => {
  return (
    <h3
      style={{
        position: "absolute",
        top: "5px",
        left: "40%",
        height: "5vh",
        width: "20%",
        textAlign: "center",
        color: " rgb(81, 194, 37)",
        fontWeight: "bolder",
      }}
    >
      {content}
    </h3>
  );
};
