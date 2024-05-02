import {
  CHANGE_NUMBER,
  NAV,
  UPDATE_ANSWERED,
  CHANGE_VARIABLE,
  CHANGE_TYPE,
  HIDEICON,
  UPDATEERROR,
  DESTROY,
  UPLOADIMAGE,
  LOGIN
} from "../action/type";
import {QuizData} from "../question";
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
  warning: { signup: true, login: false },
  successmessage: "",
  error: "both passwords must be equal before you can register",
  img: "",
  biodata: {
    username: "",
    password: "",
    department: "",
    image: "",
    activity: { subject: "", time: 0, score: 0, questions: QuizData },
  },
  password1: "",
  password2: "",
};

export const itemreducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      const { subject, questions, time } = action.payload;
      return {
        ...state,
        biodata: {
          ...state.biodata,
          activity: {
            ...state.biodata.activity,
            subject: subject,
            questions: questions,
            time: time,
          },
        },
      };
    case CHANGE_NUMBER:
      return {
        ...state,
        number: action.payload,
      };
    case UPLOADIMAGE:
      const { image, shownimage } = action.payload;
      return {
        ...state,
        img: shownimage,
        biodata: { ...state.biodata, image: image },
      };
    case DESTROY:
      return {
        ...state,
        password1: "",
        password2: "",
        eyeicon1: false,
        eyeicon2: false,
        img: "",
        type1: true,
        type2: true,
        biodata: {
          username: "",
          password: "",
          image: null,
          department: "",
          score: 0,
        },
      };
    case UPDATEERROR:
      let { part, message } = action.payload;
      if (part === "signup-warning") {
        return {
          ...state,
          error: message,
          warning: { ...state.warning, signup: true },
        };
      }
      if (part === "login-warning") {
        return {
          ...state,
          error: message,
          warning: { ...state.warning, login: true },
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
      switch (type) {
        case "password1":
          return {
            ...state,
            password1: name,
          };
        case "UserName":
          return {
            ...state,
            biodata: {
              ...state.biodata,
              username: name,
              image: name,
            },
          };
        case "password2":
          if (name === state.password1) {
            return {
              ...state,
              password2: name,
              warning: { ...state.warning, signup: false },
              biodata: { ...state.biodata, password: name },
            };
          } else {
            return {
              ...state,
              password2: name,
              warning: { ...state.warning, signup: true },
            };
          }
        case "Department":
          return {
            ...state,
            biodata: { ...state.biodata, department: name },
          };
        case "password":
          return {
            ...state,
            biodata: { ...state.biodata, password: name },
          };
        case "adminsubject":
          return {
            ...state,
            biodata: {
              ...state.biodata,
              activity: { ...state.biodata.activity, subject: name },
            },
          };
        case "admintime":
          return {
            biodata: {
              ...state.biodata,
              activity: { ...state.biodata.activity, time: name },
            },
          };
        default:
          return state;
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
