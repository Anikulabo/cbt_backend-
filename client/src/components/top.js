import "./top.css"
export const Welcome = () => {
  return (
    <div className="container-fluid">
      <div className="row text-lemon" style={{border:"0.5px solid gray"}}>
        <div className="col-2" style={{borderRight:"1px solid gray"}}>
          <h4>E-Exam</h4>
        </div>
        <div className="col-10 d-flex justify-content-between" >
          <button type="button" className="btn btn-light text-lemon" style={{borderCollapse:"collapse"}}>
          &#9776;
          </button>
          <span> <button className="btn btn-light" style={{borderRadius:"50px",color:"green"}}><i class="fas fa-user"></i></button>Username <i class="fas fa-caret-down"></i></span>
        </div>
      </div>
    </div>
  );
};
