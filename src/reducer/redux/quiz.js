import {
    GET_QUIZ_SUCCEED,
    LIST_QUIZZES_SUCCEED,
    GET_CORRECT_ANSWER_SUCCEED,
} from '../action/actions_type';

const initialState = {
    quizzes: [],
    quiz: {},
    correctAnswer: {},
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
        case LIST_QUIZZES_SUCCEED:
            return {
                ...state,
                quizzes: payload.quizzes,
                page: payload.page,
                totalPage: payload.totalPage
            }
        case GET_QUIZ_SUCCEED:
            return {
                ...state,
                quiz: payload
            }
        case GET_CORRECT_ANSWER_SUCCEED:
            return {
                ...state,
                correctAnswer: payload
            }
        default:
            return state
    }
}

export default quiz
