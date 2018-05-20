import React from "react";
import ReactOnRails from "react-on-rails";

import { login } from "../../util/UserApi";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }

  signIn = e => {
    e.preventDefault();
    let headers = ReactOnRails.authenticityHeaders();
    console.log(headers);
    const formData = new URLSearchParams();

    formData.append("email", "g@g.com");
    formData.append("password", "123");
    // formData.append("authenticity_token", ReactOnRails.authenticityToken());

    login(formData, headers).then(status => console.log(status));
  };

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Please sign in</h3>
        </div>
        <div className="panel-body">
          <form
            acceptCharset="UTF-8"
            role="form"
            onSubmit={e => this.signIn(e)}
          >
            <fieldset>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="E-mail"
                  name="email"
                  type="text"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  type="password"
                />
                <input
                  name="authenticity_token"
                  type="hidden"
                  value={this.props.csrf}
                />
              </div>
              <input
                className="btn btn-lg btn-success btn-block"
                type="submit"
                value="Login"
              />
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}
