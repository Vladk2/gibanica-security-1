import React from "react";
import LoginForm from "./LoginForm";
import { Jumbotron, Button } from "react-bootstrap";
import NavBar from "../navbar/NavBar";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="row" style={{ width: "90%", marginTop: "10%" }}>
          <div className="col-md-1" />
          <div className="col-md-8">
            <Jumbotron>
              <h1>Hello, world!</h1>
              <p>
                This is a simple hero unit, a simple jumbotron-style component
                for calling extra attention to featured content or information.
              </p>
              <p>
                <Button bsStyle="primary">Learn more</Button>
              </p>
            </Jumbotron>
          </div>
          <div className="col-md-3">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }
}
