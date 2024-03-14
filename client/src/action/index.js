import { CHANGE_NUMBER, NAV,UPDATE_ANSWERED,SEND_NAME, SEND_PASSWORD } from "./type";
export const changenum = (number, operator,total) => {
  let newItem;
  if (operator === "add") {
    newItem = number + 1;
  } else if (operator === "subtract") {
    newItem = number - 1;
  } else {
    if(operator-1<total){
      newItem = operator - 1;  
    }
    else{
      alert(total)
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
export const updateAnswered=(ansi,indexi)=>{
  return{
    type:UPDATE_ANSWERED,
    payload:{ansi,indexi}
  }
}
export const sendPassword=(password)=>{
  return{
    type:SEND_PASSWORD,
    payload:password
  }
}
export const sendName=(name)=>{
  return{
    type:SEND_NAME,
    payload:name
  }
}
