import {
  CHANGE_NUMBER,
  NAV,
  UPDATE_ANSWERED,
  CHANGE_VARIABLE,
  HIDEICON,
  CHANGE_TYPE,
  UPDATEERROR,
  DESTROY,
  UPLOADIMAGE,
  LOGIN,
} from "./type";
export const changenum = (number, operator, total) => {
  let newItem;
  if (operator === "add") {
    newItem = number + 1;
  } else if (operator === "subtract") {
    newItem = number - 1;
  } else {
    if (operator - 1 < total) {
      newItem = operator - 1;
    } else {
      alert(total);
    }
  }
  return {
    type: CHANGE_NUMBER,
    payload: newItem,
  };
};
export const shownav = (val) => {
  return {
    type: NAV,
    payload: !val,
  };
};
export const updateAnswered = (ansi, indexi,num) => {
  return {
    type: UPDATE_ANSWERED,
    payload: { ansi, indexi,num },
  };
};
export const changeVariable = (name, type) => {
  return {
    type: CHANGE_VARIABLE,
    payload: { type, name },
  };
};
export const changeType = (which) => {
  return {
    type: CHANGE_TYPE,
    payload: which,
  };
};
export const hideIcon = (where, length) => {
  return {
    type: HIDEICON,
    payload: { where, length },
  };
};
export const destroy = () => {
  return {
    type: DESTROY,
    payload: "",
  };
};
export const handleUploadPhoto = (image, shownimage) => {
  return {
    type: UPLOADIMAGE,
    payload: { image, shownimage },
  };
};
export const handlelogin = (subject, questions,time,dept,scoreid) => {
  alert(scoreid);
  return{
    type:LOGIN,
    payload:{subject,questions,time,dept,scoreid}
  }
};
export const updatemessage = (part, message) => {
  return {
    type: UPDATEERROR,
    payload: { part, message },
  };
};
