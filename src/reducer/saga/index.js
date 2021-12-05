import { call, takeLatest } from 'redux-saga/effects'
import _ from "lodash";
import repository from '../../api/repository';

import {
  CREATE_QUIZ, GET_QUIZ,
} from "../action/actions_type";

function* createQuiz(action) {
  try{
    yield call((payload) => repository.updateQuiz(payload), action.payload);
    if (_.isFunction(action.callback)) action.callback(null);
  }catch(e){
    if (_.isFunction(action.callback)) action.callback(e);
  }
}

function* getQuiz(action) {
  try{
    const res = yield call((payload) => repository.getQuiz(payload), action.payload);
    if (_.isFunction(action.callback)) action.callback(res, null);
  }catch(e){
    if (_.isFunction(action.callback)) action.callback(null, e);
  }
}

function* rootSaga() {
  yield takeLatest(CREATE_QUIZ, createQuiz);
  yield takeLatest(GET_QUIZ, getQuiz);
}

export default rootSaga;