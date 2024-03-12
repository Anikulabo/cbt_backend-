import { CHANGE_NUMBER, NAV,UPDATE_ANSWERED } from "../action/type";
const initialstate = {
  number: 0,
  answered: [],
  timeRemaining: 120,
  showtable: false,
  showAlert: true,
  showDecision: false,
  testStarted: false,
};
export const itemreducer = (state = initialstate, action) => {
  switch (action.type) {
    case CHANGE_NUMBER:
      const operation = action.payload;
      return {
        ...state,
        number: operation,
      };
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
