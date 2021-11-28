import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";

import rootReducer from "./reducer/redux"
import rootSage from "./reducer/saga";

import Index from "views/Index.js";
import LandingPage from "views/examples/LandingPage.js";
import RegisterPage from "views/examples/RegisterPage.js";
import ProfilePage from "views/examples/ProfilePage.js";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSage)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/components" render={(props) => <Index {...props} />} />
        <Route
          path="/landing-page"
          render={(props) => <LandingPage {...props} />}
        />
        <Route
          path="/register-page"
          render={(props) => <RegisterPage {...props} />}
        />
        <Route
          path="/profile-page"
          render={(props) => <ProfilePage {...props} />}
        />
        <Redirect from="/" to="/components" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
