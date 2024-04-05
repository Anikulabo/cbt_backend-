import "./top.css";
import { changeVariable, changeType, hideIcon } from "../action";
import { useDispatch, useSelector } from "react-redux";
export const Forms = () => {
  let dispatch = useDispatch();
  let small = useSelector((state) => state.items.warning);
  let error = useSelector((state) => state.items.error);
  let passvalue = useSelector((state) => state.items.password1);
  let name = useSelector((state) => state.items.name);
  let password1 = useSelector((state) => state.items.type1);
  let eyeicon1 = useSelector((state) => state.items.eyeicon1);
  let eyeicon2 = useSelector((state) => state.items.eyeicon2);
  let password2 = useSelector((state) => state.items.type2);
  return (
    <form className="container-fluid">
      <small style={{ marginTop: "5rem" }} className="text-success">
        {useSelector((state) => state.items.successmessage)}
      </small>
      <div style={{ marginTop: "50px", marginLeft: "0" }}>
        UserName <br />
        <input
          type="text"
          className="data"
          placeholder="enter your username"
          value={name}
          onChange={(event) =>
            dispatch(changeVariable(event.target.value, "username"))
          }
        />
        <br />
      </div>
      <div
        style={{ marginTop: "50px", marginLeft: "0" }}
      >
        Password
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={password1 ? "password" : "text"}
            className="data"
            placeholder="input a password you can remember"
            value={passvalue}
            onChange={(event) => {
              dispatch(changeVariable(event.target.value, "password1"));
              dispatch(hideIcon(1,event.target.value.length))
            }}
          />
          <i
            class={!password1 ? "fa fa-eye" : "fa fa-eye-slash"}
            style={{
              display: eyeicon1 ? "block" : "none",
              marginLeft: "-3rem",
            }}
            onClick={() => dispatch(changeType(1))}
          />
        </div>
        <br />
      </div>
      <div
        style={{ marginTop: "50px", marginLeft: "0" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={password2 ? "password" : "text"}
            className="data"
            placeholder="re-type your password"
            onChange={(event) =>{
              dispatch(changeVariable(event.target.value, "password"))
              dispatch(hideIcon(2,event.target.value.length))
            }
            }
          />
          <i
            class={password2 ? "fa fa-eye-slash" : "fa fa-eye"}
            style={{
              display: eyeicon2 ? "block" : "none",
              marginLeft: "-3rem",
            }}
            onClick={() => {
              dispatch(changeType(2));
            }}
          />
        </div>
        <small
          className="text-danger"
          style={{ display: small ? "block" : "none" }}
        >
          {error}
        </small>
        <div style={{ marginTop: "50px", marginLeft: "0" }}>
        Department <br />
        <input
          type="text"
          className="data"
          placeholder="enter your username"
          value={name}
          onChange={(event) =>
            dispatch(changeVariable(event.target.value, "username"))
          }
        />
        <br />
      </div>
      </div>
    </form>
  );
};
