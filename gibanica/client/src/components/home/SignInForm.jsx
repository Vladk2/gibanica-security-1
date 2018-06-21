import React from "react";
import Layer from "grommet/components/Layer";
import LoginForm from "grommet/components/LoginForm";
import Anchor from "grommet/components/Anchor";
import Notification from "grommet/components/Notification";
import { login } from "../../util/UserApi";

export default class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      badLogin: false,
      nothingEntered: false
    };
  }

  signIn = credentials => {
    if (!credentials.username || !credentials.password) {
      this.setState({ nothingEntered: true });
      return;
    }

    login(credentials.username, credentials.password)
      .then(res => {
        if (res.status === 200) {
          // set to local storage
          localStorage.setItem("token", res.data.token);

          window.location.assign("/logs");
          return;
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.setState({ badLogin: true, nothingEntered: false });
        }
      });
  };

  render() {
    const { badLogin, nothingEntered } = this.state;

    return (
      <Layer
        align="center"
        closer={true}
        overlayClose
        onClose={this.props.closeModal}
      >
        <div>
          {nothingEntered ? (
            <div style={{ marginTop: 50 }}>
              <Notification
                message="Please enter your credentials"
                closer
                size="small"
                status="Warning"
              />
            </div>
          ) : null}
          {badLogin ? (
            <div style={{ marginTop: 50 }}>
              <Notification
                message="Wrong credentials"
                closer
                size="small"
                status="Critical"
              />
            </div>
          ) : null}
          <LoginForm
            onSubmit={credentials => this.signIn(credentials)}
            forgotPassword={
              <Anchor href="/forgot_password" label="Forgot password?" />
            }
          />
        </div>
      </Layer>
    );
  }
}
