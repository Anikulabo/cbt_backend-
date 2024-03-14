import { text } from "body-parser";
import { CHANGE_NUMBER, NAV,UPDATE_ANSWERED,SEND_PASSWORD,SEND_NAME } from "../action/type";
const initialstate = {
  number: 0,
  answered: [],
  timeRemaining: 120,
  showtable: false,
  showAlert: true,
  showDecision: false,
  testStarted: false,
  warning:true,
  name:"",
  password:"",
  image:"",
  score:""
};
export const itemreducer = (state = initialstate, action) => {
  switch (action.type) {
    case CHANGE_NUMBER:
      const operation = action.payload;
      return {
        ...state,
        number: operation,
      };
    case SEND_NAME:
      const name=action.payload;
      return{
        ...state,
        name:name,
      }  
    case SEND_PASSWORD:
      const password=action.payload;
      return{
        ...state,
        password:password,
        warning:false,
      }
    case NAV:
      const val = action.payload;
      return {
        ...state,
        showtable: val,
      };
    case UPDATE_ANSWERED:
      const { ansi, indexi } = action.payload;
      const questionIndex = state.answered.findIndex(
        (item) => item.id === indexi
      );
      let newanswered;
      if (questionIndex >= 0) {
        newanswered = state.answered.map((ans, index) => {
          if (index === questionIndex) {
            return { id: index, answer: ansi };
          } else {
            return ans;
          }
        });
        return {
          ...state,
          answered: newanswered,
        };
      } else {
        return {
          ...state,
          answered: [...state.answered, { id: indexi, answer: ansi }],
        };
      }
       default:
      return state;
  }
};
