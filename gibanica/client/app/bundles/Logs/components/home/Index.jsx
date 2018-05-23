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
        <div className="row" style={{ width: "90%", marginTop: "10%" }}>
          <div className="col-md-1" />
          <div className="col-md-8">
            <Jumbotron>
              <h1>Gibanica Mental Facility</h1>
              <p>
                Ah ah ay, corazón espinado Cómo duele, me duele no amar Ah ah
                ay, cómo me duele el amor
              </p>
              <p>
                Y cómo duele, cómo duele el corazón Cuando uno es bien entregado
                Pero no olvides mujer que algún día dirás Ay ay ay, cómo me
                duele el amor
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
