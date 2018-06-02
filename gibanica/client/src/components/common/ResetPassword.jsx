import React from "react";
import { Radio } from "react-bootstrap";
import { sendResetLink } from "../../util/UserApi";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: false
    };
  }

  componentWillMount() {
    if (localStorage.getItem("token")) {
      this.setState(
        {
          logged: true
        },
        () => window.location.replace("/logs")
      );
    }
  }

  hideEmail = email => {
    let hiddenEmail = email;

    const tokens = hiddenEmail.split("@");

    const username = tokens[0];
    const domain = tokens[1];

    if (username.length > 1) {
      hiddenEmail =
        username[0] +
        "*".repeat(username.length - 2) +
        username[username.length - 1] +
        "@" +
        domain;
    } else {
      hiddenEmail = `${username}@${"*".repeat(domain.length)}`;
    }

    return hiddenEmail;
  };

  sendEmail = () => {
    if (!this.props.email) {
      return null;
    }

    sendResetLink(this.props.email).then(res => {
      console.log(res);
    });
  };

  render() {
    const { logged } = this.state;
    const { email } = this.props;

    if (logged) {
      return null;
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
          <h4>
            We found the following information associated with your account.
          </h4>
          <br />
          <div
            style={{
              textAlign: "left",
              paddingLeft: "5%"
            }}
          >
            <Radio checked readOnly>
              {this.hideEmail(email)}
            </Radio>
            <br />
            <button
              onClick={this.sendEmail}
              className="btn"
              type="button"
              style={{
                backgroundColor: "#669999",
                color: "#FFFFFF",
                borderRadius: 25
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}
