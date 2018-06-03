import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "./components/home/Index";
import LogsListing from "./components/LogsListing";
import "./App.css";
import ForgotPassword from "./components/common/ForgotPassword";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Index} />
          <Route exact path="/logs" component={LogsListing} />
          <Route exact path="/forgot_password" component={ForgotPassword} />
        </div>
      </Router>
    );
  }
}

export default App;
