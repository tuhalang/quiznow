import {combineReducers} from "redux";

import quiz from "./quiz";
import common from "./common";

const rootReducer = combineReducers({
    quiz,
    common
})

export default rootReducer;