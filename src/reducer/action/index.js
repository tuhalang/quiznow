import {
    CREATE_QUIZ,
    GET_QUIZ
} from "./actions_type";

export const createQuiz = (id, type, owner, content, answer, expireDate, expireDateVoting, callback) => {
    return {
        type: CREATE_QUIZ,
        payload: {
            id, type, owner, content, answer, expireDate, expireDateVoting
        },
        callback,
    }
}

export const getQuiz = (id) => {
    return {
        type: GET_QUIZ,
        payload: {
            id
        },
    }
}