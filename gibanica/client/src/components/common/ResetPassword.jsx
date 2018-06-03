import React from "react";
import { resetPassword } from "../../util/UserApi";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordValidationMessage: undefined,
      passwordsDontMatch: false,
      requestExpired: false,
      requestAlreadySubmitted: false
    };

    this.password = "";
    this.password_repeat = "";
  }

  componentWillMount() {
    this.link = this.parseUrl();
  }

  parseUrl = () => {
    const search_params = this.props.location.search;
    if (search_params) {
      const token = search_params.split("?link=")[1];
      this.token = token;
    }
  };

  submit = () => {
    if (this.passwordsMatch()) {
      this.resetRequestCheckers();
      resetPassword(this.password, this.token)
        .then(res => {
          if (res.status === 200) {
            window.location.replace("/");
          } else if (res.status === 204) {
            alert("Link from your email is not recognized");
          }
        })
        .catch(err => {
          if (err.response.status === 406) {
            this.setState({ requestExpired: true });
          } else if (err.response.status === 423) {
            this.setState({ requestAlreadySubmitted: true });
          }
        });
    } else {
      this.setState({ passwordsDontMatch: true });
    }
  };

  resetRequestCheckers = () => {
    this.setState({
      requestAlreadySubmitted: false,
      requestExpired: false,
      passwordsDontMatch: false
    });
  };

  passwordStrong = password => {
    if (password.length > 0) {
      if (/(?=.*[\\])/.test(password)) {
        // backslash is not allowed
        this.setState({
          passwordValidationMessage: "Backslash is not allowed"
        });
      } else if (!/^.{8,}$/.test(password)) {
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
          passwordValidationMessage:
            "Password must contain at least 1 uppercase letter"
        });
      } else if (!/(?=.*[a-z])/.test(password)) {
        // at least 1 small letter
        this.setState({
          passwordValidationMessage:
            "Password must contain at least 1 downcase letter"
        });
      } else if (!/(?=.*[ !@#$%^&*+=~.,:;/"'`?{}[\]<>()])/.test(password)) {
        // at least 1 special character
        this.setState({
          passwordValidationMessage:
            "Password must contain at 1 least special character \n ( !@#$%^&*+=~.,:;/\" '`?{}" +
            "[]()<>)"
        });
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
    const {
      passwordValidationMessage,
      passwordsDontMatch,
      requestAlreadySubmitted,
      requestExpired
    } = this.state;
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
            <br />
            <p>
              Strong passwords include numbers, letters, and special characters.
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
                {passwordValidationMessage.includes("\n") ? (
                  <b>
                    {passwordValidationMessage.split("\n")[0]}
                    <br /> {passwordValidationMessage.split("\n")[1]}
                  </b>
                ) : (
                  <b>{passwordValidationMessage}</b>
                )}
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
            {requestExpired ? (
              <p
                style={{
                  color: "orange"
                }}
              >
                This request has expired
              </p>
            ) : null}
            {requestAlreadySubmitted ? (
              <p
                style={{
                  color: "orange"
                }}
              >
                This request has already been submitted
              </p>
            ) : null}
            {passwordsDontMatch ? (
              <label
                style={{
                  color: "red"
                }}
              >
                <b>Passwords don`t match</b>
              </label>
            ) : null}
            <br />
            <button
              onClick={this.submit}
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
