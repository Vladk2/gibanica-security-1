import React from "react";

export default class PasswordResetEmailSent extends React.Component {
  render() {
    const { resend, hiddenEmail } = this.props;

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
          <h4>Check your email</h4>
          <div
            style={{
              textAlign: "left",
              paddingLeft: "5%"
            }}
          >
            <p>
              We've sent an email to {hiddenEmail}. Click the link in the email
              to reset your password.
              <br />
              <br />
              If you don't see the email, check other places it might be, like
              your junk, spam, social, or other folders.
            </p>
            <br />
            <div
              style={{
                textAlign: "left",
                paddingLeft: "5%"
              }}
            >
              <button
                onClick={resend}
                className="btn"
                type="button"
                style={{
                  backgroundColor: "#669999",
                  color: "#FFFFFF",
                  borderRadius: 25
                }}
              >
                I didn't receive the email. Send again.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
