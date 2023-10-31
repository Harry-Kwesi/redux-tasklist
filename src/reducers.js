import { combineReducers } from "redux";
import tasksReducer from "./taskreducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  // Add other reducers here if needed
});

export default rootReducer;
