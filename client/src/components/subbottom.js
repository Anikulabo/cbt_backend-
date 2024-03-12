export const Bottom = ({number,action,btndisplay,ctrl}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "5px",
        marginBottom: "10px", // Adjust as needed
      }}
    >
      <button
        className="btn btn-light text-light previous-button"
        style={{ backgroundColor: "rgb(81, 194, 37)",display:btndisplay.previous}}
        onClick={(event)=>{action(event);}}
      >
        <i class="fas fa-arrow-left"></i>
       <span style={{marginLeft:"3px"}}> Previous</span>
      </button>
      <button
        className="btn btn-light text-light"
        style={{ backgroundColor: "rgb(81, 194, 37)"}}
        onClick={()=>{ctrl();}}
      >
        <i class="fas fa-th-large "></i>
        <span style={{marginLeft:"3px"}}>Navigation</span>
      </button>
      <button
        className="btn btn-light text-light next-button"
        style={{ backgroundColor: "rgb(81, 194, 37)" ,display:btndisplay.next}}
        onClick={(event)=>{action(event);}}
      >
        <span style={{marginRight:"3px"}}>Next</span>
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};
