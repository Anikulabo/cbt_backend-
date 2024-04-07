import {
  CHANGE_NUMBER,
  NAV,
  UPDATE_ANSWERED,
  CHANGE_VARIABLE,
  CHANGE_TYPE,
  HIDEICON,
  UPDATEERROR,
  DESTROY,
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
  successmessage: "",
  error: "both passwords must be equal before you can register",
  biodata: { username: "", password: "", department: "", image: "", score: 0 },
  password1: "",
  password2: "",
};

export const itemreducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NUMBER:
      return {
        ...state,
        number: action.payload,
      };
    case DESTROY:
      return {
        ...state,
        password1:"",
        password2:"",
        eyeicon1: false,
        eyeicon2: false,
        biodata: {
          name: "",
          password: "",
          department: "",
          image: "",
          score: 0,
        },
      };
    case UPDATEERROR:
      const { part, message } = action.payload;
      if (part === "warning") {
        return {
          ...state,
          warning: true,
          error: message,
        };
      }
      if (part === "success") {
        return {
          ...state,
          warning: false,
          successmessage: message,
        };
      }
    case HIDEICON:
      const { where, length } = action.payload;
      if (where === 1 && length >= 1) {
        return {
          ...state,
          eyeicon1: true,
        };
      }
      if (where === 1 && length <= 0) {
        return {
          ...state,
          eyeicon1: false,
        };
      } else {
        if (where === 2 && length >= 1) {
          return {
            ...state,
            eyeicon2: true,
          };
        }
        if (where === 2 && length <= 0) {
          return {
            ...state,
            eyeicon2: false,
          };
        }
      }
    case CHANGE_TYPE:
      const which = action.payload;
      if (which === 1) {
        return {
          ...state,
          type1: !state.type1,
        };
      } else {
        return {
          ...state,
          type2: !state.type2,
        };
      }
    case CHANGE_VARIABLE:
      const { type, name } = action.payload;
      if (type === "password1") {
        return {
          ...state,
          password1: name,
        };
      }
      if (type === "username") {
        return {
          ...state,
          biodata: { ...state.biodata, username: name, image: name },
        };
      }
      if (type === "password2") {
        if(name===state.password1){
          return{
            ...state,
            password2:name,
            warning:false,
            biodata:{...state.biodata,password:name}
          }
        }else{
          return {
            ...state,
            password2: name,
            warning:true
          };
        }
      }
      if (type === "department") {
        return {
          ...state,
          biodata: { ...state.biodata, department: name },
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
