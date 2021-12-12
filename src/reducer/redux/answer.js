import {
    LIST_ANSWERS_SUCCEED
} from '../action/actions_type';

const initialState = {
    answers: [],
    page: 1,
    totalPage: 0
}

const answer = (state, action) => {
    if (typeof state === "undefined") {
        return initialState
    }
    const { payload } = action

    switch (action.type) {
        case LIST_ANSWERS_SUCCEED:
            return {
                ...state,
                answers: payload.answers,
                page: payload.page,
                totalPage: payload.totalPage
            }
        default:
            return state
    }
}

export default answer
