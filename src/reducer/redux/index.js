import {combineReducers} from "redux";

import quiz from "./quiz";
import answer from "./answer";

const rootReducer = combineReducers({
    quiz,
    answer,
})

export default rootReducer;