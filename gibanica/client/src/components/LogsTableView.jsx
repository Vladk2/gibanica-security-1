import React from "react";

export default class LogsTableView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {logs} = this.props;
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Time</th>
            <th>Host</th>
            <th>Process</th>
            <th>Severity</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, key) => (
            <tr key={key}>
              <td>{log.logged_time}</td>
              <td>{log.host}</td>
              <td>{log.process}</td>
              <td>{log.severity}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
