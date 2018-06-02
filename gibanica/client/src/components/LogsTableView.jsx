import React from "react";
import { Table } from "react-bootstrap";

export default class LogsTableView extends React.Component {
  parseDate = date => new Date(date).toUTCString();

  render() {
    const { logs } = this.props;

    return (
      <Table striped hover>
        <thead>
          <tr>
            <th className="text-center">Time</th>
            <th className="text-center">Host</th>
            <th className="text-center">Process</th>
            <th className="text-center">Severity</th>
            <th className="text-center">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, key) => (
            <tr key={key}>
              <td>{this.parseDate(log.logged_time)}</td>
              <td>{log.host}</td>
              <td>{log.process}</td>
              <td>{log.severity}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
