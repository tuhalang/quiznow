import Client from "./client"

const updateQuiz = (data) => {
    return Client.post("/api/v1/quizzes", data);
}

const getQuiz = (data) => {
    return Client.get("/api/v1/quizzes/" + data.id);
}

const repository = {
    updateQuiz,
    getQuiz
};

export default repository;