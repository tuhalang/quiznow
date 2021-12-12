import Client from "./client"

const updateQuiz = (data) => {
    return Client.post("/api/v1/quizzes", data);
}

const getQuiz = (data) => {
    return Client.get("/api/v1/quizzes/" + data.id);
}

const listQuizzes = (data) => {
    return Client.get("/api/v1/quizzes?page=" + data.page + "&size=" + data.size);
}

const updateAnswer = (data) => {
    return Client.post("/api/v1/answers", data);
}

const listAnswers = (data) => {
    return Client.get("/api/v1/answers?page=" + data.page + "&size=" + data.size + "&qid=" + data.qid);
}

const updateResultQuiz = (data) => {
    return Client.put("/api/v1/quizzes/" + data.id);
}

const getCorrectAnswer = (data) => {
    return Client.get("/api/v1/quizzes/winner/" + data.id);
}

const updateAnswerVote = (data) => {
    return Client.put("/api/v1/answers", data);
}

const repository = {
    updateQuiz,
    getQuiz,
    listQuizzes,
    updateAnswer,
    listAnswers,
    updateResultQuiz,
    getCorrectAnswer,
    updateAnswerVote,
};

export default repository;