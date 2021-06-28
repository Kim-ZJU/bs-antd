import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Main from "./containers/main";
import Login from "./containers/login";
import Register from "./containers/register";
import { Provider } from "mobx-react";
import "./assets/less/index.less";
import store from "./store";
import App from "./containers/App";
ReactDOM.render(
  <Provider store={store}>
    <App>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/main" component={Main}></Route>
        <Redirect to="/main/homepage" />
      </Switch>
    </BrowserRouter>
    </App>
  </Provider>,
  document.getElementById("root")
);
