import React from "react";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row vertical-offset-100">
          <div className="col-md-4 col-md-offset-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Please sign in</h3>
              </div>
              <div className="panel-body">
                <form accept-charset="UTF-8" role="form">
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
                        value=""
                      />
                    </div>
                    <input
                      onClick={() => console.log("logging in ...")}
                      className="btn btn-lg btn-success btn-block"
                      type="submit"
                      value="Login"
                    />
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
