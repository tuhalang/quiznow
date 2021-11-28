const initialState = {
    quizzes: [],
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
        default:
            return state
    }
}

export default quiz
