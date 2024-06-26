import "./top.css";
import { useSelector  } from "react-redux";
export const Easynavigator = ({ num, show,action,answered }) => {
  let table=[];
  let questions=useSelector((state)=>state.items.biodata.activity.questions)
  let tr=0;
  let totalrow=questions.length/10;
  for (let i = 0; i < totalrow; i++) {
      table.push([]);
    }
    while (tr < table.length) {
      if (tr === 0) {
        for (let td = 0; td < 10; td++) {
          table[tr].push(td+1);
        }
      } else {
        let prev = table[tr - 1];
        let prevlast = prev[prev.length - 1];
        for (let td = prevlast; td < prevlast + 10; td++) {
          table[tr].push(td+1);
        }
      }
    tr++;
    }
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-end vh-100 mr-4"
      style={{ marginRight: "15rem", position: "relative" }} // Add position:relative to enable absolute positioning of the table
    >
      <div className="col-md-3">
        <table
          className={
            show
              ? "table table-bordered table-responsive d-none d-md-block"
              : "table table-bordered table-responsive d-none"
          }
          style={{
            position: "absolute",
            top: "5rem",
            width: "60%",
            right: "5.6rem",
            borderRadius:"18px",
            borderSpacing:"3px",
            borderCollapse:"separate"
          }} // Position the table absolutely above the Bottom component
        >
          <tbody>
            {table.map((tr, rowIndex) => (
              <tr key={rowIndex}>
                {" "}
                {tr.map((td, cellIndex) => {
                  const questionIndex = answered.findIndex(
                    (item) => item.num === td - 1
                  );
                  return (
                    <td
                      key={cellIndex}
                      style={{ backgroundColor: td===num+1?"rgb(81, 194, 37)":"white", color:td===num+1?"white":questionIndex>=0?"rgb(81, 194, 37)":"black", textAlign: "center",padding:"5px", opacity: "0.7", border:"1px solid rgb(81, 194, 37)", borderRadius:"10px"}}
                      onClick={(event)=>{action(event)}}
                    >
                      {td}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
