import {
    CREATE_QUIZ,
    GET_QUIZ,
    CREATE_ANSWER,
    LIST_ANSWERS,
    LIST_QUIZZES,
    UPDATE_RESULT_QUIZ,
    GET_CORRECT_ANSWER,
    UPDATE_VOTE_ANSWER
} from "./actions_type";

export const createQuiz = (id, owner, content, answer, callback) => {
    return {
        type: CREATE_QUIZ,
        payload: {
            id, owner, content, answer
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

export const listQuizzes = (page, size) => {
    return {
        type: LIST_QUIZZES,
        payload: {
            page, size
        }
    }
}

export const createAnswer = (id, qid, index, content, callback) => {
    return {
        type: CREATE_ANSWER,
        payload: {
            id, qid, index, content
        },
        callback,
    }
}

export const listAnswers = (page, size, qid) => {
    return {
        type: LIST_ANSWERS,
        payload: {
            page, size, qid
        }
    }
}

export const updateResultQuiz = (id, callback) => {
    return {
        type: UPDATE_RESULT_QUIZ,
        payload: {id},
        callback,
    }
}

export const getCorrectAnswer = (id) => {
    return {
        type: GET_CORRECT_ANSWER,
        payload: {id}
    }
}

export const updateVoteAnswer = (id, qid, index, callback) => {
    return {
        type: UPDATE_VOTE_ANSWER,
        payload: {
            id, qid, index
        },
        callback,
    }
}