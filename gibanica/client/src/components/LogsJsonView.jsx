import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter/prism";
import { light } from "react-syntax-highlighter/styles/prism";

export default class LogsJsonView extends React.Component {
  parseDate = date => new Date(date).toUTCString();

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
                <div className="row" />
                <div className="col-md-10">
                  {this.parseDate(log.logged_time)}
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
