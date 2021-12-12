import { call, put, takeLatest } from 'redux-saga/effects'
import _ from "lodash";
import repository from '../../api/repository';

import {
  CREATE_QUIZ,
  GET_QUIZ,
  GET_QUIZ_SUCCEED,
  CREATE_ANSWER,
  LIST_ANSWERS_SUCCEED,
  LIST_ANSWERS,
  LIST_QUIZZES,
  LIST_QUIZZES_SUCCEED,
  UPDATE_RESULT_QUIZ,
  GET_CORRECT_ANSWER,
  GET_CORRECT_ANSWER_SUCCEED,
  UPDATE_VOTE_ANSWER,
} from "../action/actions_type";

function* createQuiz(action) {
  console.log(action)
  try {
    yield call((payload) => repository.updateQuiz(payload), action.payload);
    if (_.isFunction(action.callback)) action.callback(null);
  } catch (e) {
    if (_.isFunction(action.callback)) action.callback(e);
  }
}

function* getQuiz(action) {
  try {
    const res = yield call((payload) => repository.getQuiz(payload), action.payload);
    yield put({ type: GET_QUIZ_SUCCEED, payload: res })
    if (_.isFunction(action.callback)) action.callback(null);
  } catch (e) {
    if (_.isFunction(action.callback)) action.callback(e);
  }
}

function* listQuizzes(action) {
  console.log(action)
  try{
    const res = yield call((payload) => repository.listQuizzes(payload), action.payload);
    yield put({type: LIST_QUIZZES_SUCCEED, payload: res});
  }catch(e){
    console.log(e);
  }
}

function* createAnswer(action) {
  try {
    yield call((payload) => repository.updateAnswer(payload), action.payload);
    if (_.isFunction(action.callback)) action.callback(null);
  } catch (e) {
    if (_.isFunction(action.callback)) action.callback(e);
  }
}

function* listAnswers(action) {
  try {
    const res = yield call((payload) => repository.listAnswers(payload), action.payload);
    yield put({type: LIST_ANSWERS_SUCCEED, payload: res});
  } catch (e) {
    console.log(e)
  }
}

function* updateResultQuiz(action) {
  try {
    yield call((payload) => repository.updateResultQuiz(payload), action.payload);
    if (_.isFunction(action.callback)) action.callback(null);
  } catch (e) {
    if (_.isFunction(action.callback)) action.callback(e);
  }
}

function* getCorrectAnswer(action) {
  try {
    const res = yield call((payload) => repository.getCorrectAnswer(payload), action.payload);
    yield put({type: GET_CORRECT_ANSWER_SUCCEED, payload: res});
  } catch (e) {
    console.log(e)
  }
}

function* updateVoteAnswer(action) {
  try {
    yield call((payload) => repository.updateAnswerVote(payload), action.payload);
    if (_.isFunction(action.callback)) action.callback(null);
  } catch (e) {
    if (_.isFunction(action.callback)) action.callback(e);
  }
}

function* rootSaga() {
  yield takeLatest(CREATE_QUIZ, createQuiz);
  yield takeLatest(CREATE_ANSWER, createAnswer);
  yield takeLatest(GET_QUIZ, getQuiz);
  yield takeLatest(LIST_ANSWERS, listAnswers);
  yield takeLatest(LIST_QUIZZES, listQuizzes);
  yield takeLatest(UPDATE_RESULT_QUIZ, updateResultQuiz);
  yield takeLatest(GET_CORRECT_ANSWER, getCorrectAnswer);
  yield takeLatest(UPDATE_VOTE_ANSWER, updateVoteAnswer);
}

export default rootSaga;