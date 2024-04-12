import "./top.css"
export const Button = (props) => {
  return (
    <button
      className="text-light bg-lemon formb"
      style={props.style}
      onClick={(event) => {
        if(props.action){
            props.action(event);    
        }
        else{
            alert("no event handler for this button yet")
        }
      }}
    >
      <i className={props.class} />
      <span style={{ marginLeft: "10px" }}>{props.content}</span>
    </button>
  );
};
