import React from "react";
import LoginForm from "./LoginForm";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <LoginForm />
          </div>
          <div className="col-md-8" />
        </div>
      </div>
    );
  }
}
