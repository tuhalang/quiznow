import {
    GET_QUIZ_SUCCEED
} from '../action/actions_type';

const initialState = {
    quizzes: [],
    quiz: null,
    page: 0,
    size: 20,
    totalPage: 0
}

const quiz = (state, action) => {
    if (typeof state === "undefined") {
        return initialState
    }
    const {payload} = action

    switch (action.type) {
        case "LIST_QUIZZES":
            return {
                ...state,
                quizzes: payload.quizzes,
                page: payload.page,
                size: payload.size,
                totalPage: payload.totalPage
            }
        case GET_QUIZ_SUCCEED:
            return {
                ...state,
                quiz: payload.quiz
            }
        default:
            return state
    }
}

export default quiz
