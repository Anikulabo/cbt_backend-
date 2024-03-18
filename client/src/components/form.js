import "./top.css";
import { changeVariable, changeType, hideIcon } from "../action";
import { useDispatch, useSelector } from "react-redux";
export const Forms = () => {
  let dispatch = useDispatch();
  let small = useSelector((state) => state.items.warning);
  let password1 = useSelector((state) => state.items.type1);
  let eyeicon1 = useSelector((state) => state.items.eyeicon1);
  let eyeicon2 = useSelector((state) => state.items.eyeicon2);
  let password2 = useSelector((state) => state.items.type2);
  return (
   <form className="container-fluid">
      <small className="bg-success">{useSelector((state)=>state.items.successmessage)}</small>
      <div style={{ marginTop: "50px", marginLeft: "0" }}>
        UserName <br />
        <input
          type="text"
          className="data"
          placeholder="enter your username"
          onChange={(event) =>
            dispatch(changeVariable(event.target.value, "username"))
          }
        />
        <br />
      </div>
      <div
        onFocus={() => dispatch(hideIcon(1))}
        //onBlur={() => dispatch(hideIcon(1))}
        style={{ marginTop: "50px", marginLeft: "0" }}
      >
        Password
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={password1 ? "password" : "text"}
            className="data"
            placeholder="input a password you can remember"
            onChange={(event) => {
              dispatch(changeVariable(event.target.value, "password1"));
            }}
          />
          <i
            class={!password1 ? "fa fa-eye" : "fa fa-eye-slash"}
            style={{ display: eyeicon1 ? "block" : "none" }}
            onClick={() => dispatch(changeType(1))}
          />
        </div>
        <br />
      </div>
      <div style={{ marginTop: "50px", marginLeft: "0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={password2?"password":"text"}
            className="data"
            placeholder="re-type your password"
            onFocus={() => dispatch(hideIcon(2))}
            //onBlur={() => dispatch(hideIcon(2))}
            onChange={(event) =>
              dispatch(changeVariable(event.target.value, "password"))
            }
          />
          <i
            class={password2 ? "fa fa-eye-slash" : "fa fa-eye"}
            style={{ display: eyeicon2 ? "block" : "none" }}
            onClick={() => {
              dispatch(changeType(2));
            }}
          />
        </div>
        <small
          className="text-danger"
          style={{ display: small ? "block" : "none" }}
        >
          both passwords must be equal before you can register
        </small>
      </div>
    </form>
  );
};
