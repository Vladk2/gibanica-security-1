import React from "react";
import { checkUserEmail } from "../../util/UserApi";
import SendPasswordResetEmail from "./SendPasswordResetEmail";

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: false,
      emailFound: undefined,
      emailNotValid: false
    };

    this.email = "";
  }

  componentWillMount() {
    if (localStorage.getItem("token")) {
      this.setState(
        {
          logged: true,
          emailFound: false
        },
        () => window.location.replace("/logs")
      );
    }
  }

  emailValidation = email => {
    return /\S+@\S+\.\S+/.test(email);
  };

  search = () => {
    this.setCheckersToDefault();

    if (this.emailValidation(this.email)) {
      checkUserEmail(this.email).then(res => {
        if (res.status === 200) {
          this.setState({ emailFound: true });
        } else {
          this.setState({ emailFound: false });
        }
      });
    } else {
      this.setState({ emailNotValid: true });
    }
  };

  setCheckersToDefault = () => {
    this.setState({ emailFound: undefined, emailNotValid: false });
  };

  render() {
    const { logged, emailFound, emailNotValid } = this.state;

    if (logged) {
      return null;
    }

    if (emailFound) {
      return <SendPasswordResetEmail email={this.email} />;
    }

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
          <h2>Find your GS Account</h2>
          <p>Enter your email address</p>
          <br />
          <div className="input-group">
            <input
              onChange={e => (this.email = e.target.value)}
              type="email"
              className="form-control"
              style={{
                borderTopLeftRadius: 25,
                borderBottomLeftRadius: 25
              }}
            />
            <div className="input-group-btn">
              <button
                onClick={this.search}
                className="btn"
                type="button"
                style={{
                  backgroundColor: "#669999",
                  color: "#FFFFFF",
                  borderTopRightRadius: 25,
                  borderBottomRightRadius: 25
                }}
              >
                Search
              </button>
            </div>
          </div>
          {emailFound === false ? (
            <p
              style={{
                color: "orange"
              }}
            >
              <b>Email not found</b>
            </p>
          ) : null}
          {emailNotValid ? (
            <p
              style={{
                color: "red"
              }}
            >
              <b>Email not valid</b>
            </p>
          ) : null}
        </div>
      </div>
    );
  }
}
