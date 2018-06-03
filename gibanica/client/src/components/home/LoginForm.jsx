import React from "react";
import { login } from "../../util/UserApi";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.email = "";
    this.password = "";
  }

  signIn = () => {
    login(this.email, this.password)
      .then(res => {
        if (res.status === 200) {
          // set to local storage
          localStorage.setItem("token", res.data.token);

          window.location.assign("/logs");
          return;
        } else {
          // show wrong login alert
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          alert("Wrong credentials");
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
          <form acceptCharset="UTF-8">
            <fieldset>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="E-mail"
                  onChange={e => (this.email = e.target.value)}
                  name="email"
                  type="text"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Password"
                  onChange={e => (this.password = e.target.value)}
                  name="password"
                  type="password"
                />
                <input
                  name="authenticity_token"
                  type="hidden"
                  value={this.props.csrf}
                />
              </div>
              <button
                className="btn btn-lg btn-success btn-block"
                type="button"
                onClick={() => this.signIn()}
              >
                Login
              </button>
            </fieldset>
          </form>
          <br />
          <a href="/forgot_password">Forgot your password?</a>
        </div>
      </div>
    );
  }
}
