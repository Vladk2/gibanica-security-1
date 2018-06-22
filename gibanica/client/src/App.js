import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogsListing from "./components/LogsListing";
import Index from "./components/home/Index";
import Agents from "./components/Agents";
import ForgotPassword from "./components/common/ForgotPassword";
import ResetPassword from "./components/common/ResetPassword";
import "./assets/stylesheets/grommet-css";
import "./App.css";
import Alarms from "./components/Alarms";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/logs" component={LogsListing} />
            <Route exact path="/alarms" component={Alarms} />
            <Route exact path="/agents" component={Agents} />
            <Route exact path="/forgot_password" component={ForgotPassword} />
            <Route exact path="/reset_password" component={ResetPassword} />
            <Route
              render={() => {
                return <b>Not found</b>;
              }}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
