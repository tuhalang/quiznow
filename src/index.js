import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";
import "assets/css/app.css"

import rootReducer from "./reducer/redux"
import rootSage from "./reducer/saga";

import Index from "views/Index.js";
import CreateQuizPage from "views/CreateQuizPage";
import QuizPage from "views/QuizPage";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSage)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/quiznow">
      <Switch>
        <Route path="/quiznow" render={(props) => <Index {...props} />} />
        <Route
          exact path="/quizzes"
          render={(props) => <CreateQuizPage {...props} />}
        />
        <Route
          exact path="/quizzes/:id"
          render={(props) => <QuizPage {...props} />}
        />
        <Redirect from="/" to="/quiznow" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
