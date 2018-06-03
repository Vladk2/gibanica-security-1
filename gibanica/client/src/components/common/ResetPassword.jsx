import React from "react";
import { resetPassword } from "../../util/UserApi";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordValidationMessage: undefined
    };

    this.password = "";
    this.password_repeat = "";
  }

  componentWillMount() {
    this.link = this.parseUrl();
  }

  parseUrl = () => {};

  submit = () => {
    if (this.passwordsMatch()) {
      resetPassword(this.password)
        .then(res => {
          if (res.status === 200) {
            window.location.replace("/");
          }
        })
        .catch(err => console.log(err.response));
    }
  };

  passwordStrong = password => {
    if (password.length > 0) {
      if (!/^.{8,}$/.test(password)) {
        // at least 8 chars
        this.setState({
          passwordValidationMessage:
            "Password must be at least 8 characters long"
        });
      } else if (!/(?=(.*\d){2})/.test(password)) {
        // at least 2 digits
        this.setState({
          passwordValidationMessage: "Password must contain at least 2 digits"
        });
      } else if (!/(?=.*[A-Z])/.test(password)) {
        // at least 1 capital letter
        this.setState({
          passwordValidationMessage: "Password must contain at 1 capital letter"
        });
      } else if (false) {
        // at least 1 small letter
      } else {
        if (this.state.passwordValidationMessage) {
          this.setState({ passwordValidationMessage: undefined });
        }
      }
    } else {
      if (this.state.passwordValidationMessage) {
        this.setState({ passwordValidationMessage: undefined });
      }
    }
  };

  passwordsMatch = () => {
    if (this.password === this.password_repeat) {
      return true;
    }

    return false;
  };

  setPassword = password => {
    this.password = password;
    this.passwordStrong(this.password);
  };

  render() {
    const { passwordValidationMessage } = this.state;
    return (
      <div>
        <div
          className="row"
          style={{
            marginTop: "1%",
            borderBottom: "1px solid #E7E7E7"
          }}
        >
          <div className="col-md-5" />
          <div className="col-md-2">
            <p>Password Reset</p>
          </div>
          <div className="col-md-5" />
        </div>
        <div
          style={{
            paddingTop: "5%",
            width: "30%",
            margin: "auto"
          }}
        >
          <div
            style={{
              textAlign: "left",
              paddingLeft: "5%"
            }}
          >
            <h2>
              <b>Reset your password</b>
            </h2>
            <p>
              Strong passwords include numbers, letters, and punctuation marks.
            </p>
            <br />
            <label>
              <b>Type your new password</b>
            </label>
            <div className="input-group">
              <input
                onChange={e => this.setPassword(e.target.value)}
                type="password"
                className="form-control"
                style={{
                  borderRadius: 25,
                  width: 300
                }}
              />
            </div>
            {passwordValidationMessage ? (
              <p
                style={{
                  color: "orange"
                }}
              >
                <b>{passwordValidationMessage}</b>
              </p>
            ) : null}
            <label>
              <b>Type your new password one more time</b>
            </label>
            <div className="input-group">
              <input
                onChange={e => (this.password_repeat = e.target.value)}
                type="password"
                className="form-control"
                style={{
                  borderRadius: 25,
                  width: 300
                }}
              />
            </div>
            <br />
            <button
              className="btn"
              type="button"
              style={{
                backgroundColor: "#669999",
                color: "#FFFFFF",
                borderRadius: 25
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
