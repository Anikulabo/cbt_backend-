export const Textinput = (props) => {
  return (
    <div style={{ marginTop: "25px", marginLeft: "0" }}>
      {props.variable} <br />
      <input
        type="text"
        className="data"
        placeholder={props.placeholder}
        value={props.username}
        onChange={(event) =>
          props.actions.changeVariable(event.target.value, props.variable)
        }
      />
      <br />
    </div>
  );
};
