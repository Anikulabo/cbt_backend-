import "./top.css";
import React from "react";
export const Forms = (props) => {
  const childrenArray = React.Children.toArray(props.children);
  return (
    <form className="container-fluid">
      <small
        className="text-danger"
        style={{ display: props.small ? "block" : "none", marginTop: "40px" }}
      >
        {props.error}
      </small>
      {childrenArray.map((child, index) => {
        return <span key={index}>{child}</span>;
      })}
    </form>
  );
};
