import React from "react";
import ReactOnRails from "react-on-rails";

import {login} from "../../util/UserApi";
import {getLogsPageAfterLogin} from "../../util/LogsApi";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.email = "";
    this.password = "";
  }

  signIn = () => {
    const formData = new URLSearchParams();

    formData.append("email", this.email);
    formData.append("password", this.password);

    login(formData, ReactOnRails.authenticityHeaders()).then(res => {
      if (res.status === 200) {
        // set to local storage
        localStorage.setItem("token", res.data.token);

        window
          .location
          .assign('/logs');

        return;
      } else {
        // show wrong login alert
      }
    });
  };

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Please sign in</h3>
        </div>
        <div className="panel-body">
          <form acceptCharset="UTF-8" role="form">
            <fieldset>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="E-mail"
                  onChange={e => (this.email = e.target.value)}
                  name="email"
                  type="text"/>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Password"
                  onChange={e => (this.password = e.target.value)}
                  name="password"
                  type="password"/>
                <input name="authenticity_token" type="hidden" value={this.props.csrf}/>
              </div>
              <button
                className="btn btn-lg btn-success btn-block"
                type="button"
                onClick={() => this.signIn()}>
                Login
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}
