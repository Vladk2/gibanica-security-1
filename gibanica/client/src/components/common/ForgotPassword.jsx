import React from "react";
import { checkUserEmail } from "../../util/UserApi";
import ResetPassword from "./ResetPassword";

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: false
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
    if (this.emailValidation(this.email)) {
      checkUserEmail(this.email).then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({ emailFound: true });
        } else {
          console.log("Email not found");
        }
      });
    }
  };

  render() {
    const { logged, emailFound } = this.state;

    if (logged) {
      return null;
    }

    if (emailFound) {
      return <ResetPassword email={this.email} />;
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
        </div>
      </div>
    );
  }
}
