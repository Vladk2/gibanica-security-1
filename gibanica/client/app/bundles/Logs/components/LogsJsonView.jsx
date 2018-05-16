import React from "react";
import { Button } from "react-bootstrap";

export default class LogsJsonView extends React.Component {
  constructor(props) {
    super(props);
  }

  prettyPrintDate = logDate => {
    console.log(new Date(logDate));
    return logDate;
  };

  render() {
    const { logs } = this.props;
    return (
      <div>
        {logs.map((log, key) => (
          <div className="row" key={key}>
            <div className="col-md-2">
              <div className="row">
                <Button bsSize="xsmall" bsStyle="info">
                  -
                </Button>
              </div>
              <div className="col-md-10">
                {this.prettyPrintDate(log.logged_time)}
              </div>
            </div>
            <div className="col-md-10" style={{}}>
              <pre>
                <code className="java">{JSON.stringify(log, null, 2)}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
