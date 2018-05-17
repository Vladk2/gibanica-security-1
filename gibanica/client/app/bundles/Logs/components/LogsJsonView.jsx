import React from "react";
import { Button } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter/prism";
import { dark, light } from "react-syntax-highlighter/styles/prism";

export default class LogsJsonView extends React.Component {
  constructor(props) {
    super(props);
  }

  prettyPrintDate = logDate => {
    // convert date from log to date string
    return new Date().toDateString();
  };

  render() {
    const { logs } = this.props;
    return (
      <div>
        {logs.map((log, key) => (
          <div key={key}>
            <div
              className="row"
              style={{
                borderWidth: 1,
                borderRadius: 15,
                borderColor: "gray",
                borderStyle: "solid",
                padding: 15
              }}
            >
              <div className="col-md-2">
                <div className="row">
                  <Button bsSize="xsmall">-</Button>
                </div>
                <div className="col-md-10">
                  {this.prettyPrintDate(log.logged_time)}
                </div>
              </div>
              <div className="col-md-10" style={{}}>
                <SyntaxHighlighter language="json" style={light}>
                  {JSON.stringify(log, null, 2)}
                </SyntaxHighlighter>
              </div>
            </div>
            <br />
          </div>
        ))}
      </div>
    );
  }
}
