import {
  CHANGE_NUMBER,
  NAV,
  UPDATE_ANSWERED,
  CHANGE_VARIABLE,
  CHANGE_TYPE,
  HIDEICON,
  UPDATEERROR,
  DESTROY
} from "../action/type";
const initialState = {
  number: 0,
  answered: [],
  timeRemaining: 120,
  showtable: false,
  showAlert: true,
  showDecision: false,
  testStarted: false,
  eyeicon1: false,
  eyeicon2: false,
  type1: true,
  type2: true,
  warning: true,
  successmessage:"",
  error:"both passwords must be equal before you can register",
  name: "",
  password1: "",
  password: "",
  image: "",
  score: 0,
  status:"pending"
};

export const itemreducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NUMBER:
      return {
        ...state,
        number: action.payload,
      };
    case DESTROY:
      return{
        ...state,
        name:"",
        password1:"",
        password:""
      }  
    case UPDATEERROR:
    const {part,message}=action.payload  
    if(part==="warning"){
      return{
        ...state,
        warning:true,
        error:message
      }  
    }
   if(part==="success"){
      return{
        ...state,
        warning:false,
        successmessage:message,
      }
    }  
    case HIDEICON:
      const where=action.payload;
      if(where===1){
        return{
          ...state,
          eyeicon1:!state.eyeicon1,
        }
      }else{
        return{
          ...state,
          eyeicon2:!state.eyeicon2,
        }
      }
      case CHANGE_TYPE:
      const  which  = action.payload;
     if(which===1){
      return{
        ...state,
        type1:!state.type1,
      }
     }else{
      return{
        ...state,
        type2:!state.type2,
      }
     }
    case CHANGE_VARIABLE:
      const { type, name } = action.payload;
      if (type === "password1") {
        return {
          ...state,
          password1: name,
        };
      } else if (type === "username") {
        return {
          ...state,
          name: name,
        };
      } else if (type === "password" && name === state.password1) {
        return {
          ...state,
          warning: !state.warning,
          password: name,
        };
      }
    case NAV:
      return {
        ...state,
        showtable: action.payload,
      };
    case UPDATE_ANSWERED:
      const { ansi, indexi } = action.payload;
      const questionIndex = state.answered.findIndex(
        (item) => item.id === indexi
      );
      if (questionIndex >= 0) {
        const newAnswered = state.answered.map((ans, index) => {
          if (index === questionIndex) {
            return { id: index, answer: ansi };
          } else {
            return ans;
          }
        });
        return {
          ...state,
          answered: newAnswered,
        };
      } else {
        return {
          ...state,
          answered: [...state.answered, { id: indexi, answer: ansi }],
        };
      }
    default:
      return state; // Return the unchanged state for unknown actions
  }
};
