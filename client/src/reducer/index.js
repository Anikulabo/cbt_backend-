import { combineReducers } from "redux";
import { itemreducer } from "./itemreducer";
export  const rootReducer = combineReducers({
    items: itemreducer,
});