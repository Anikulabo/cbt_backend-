import "./top.css";
import React from "react";
export const Rightbottom = (props) => {
  const childrenArray = React.Children.toArray(props.children);
  return (
    <div style={{ position: "absolute", bottom: "10px" }}>
      {childrenArray.map((child, index) => {
        return <span key={index}>{child}</span>;
      })}
    </div>
  );
};
