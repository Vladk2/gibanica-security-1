import React from "react";
import { Router, Link } from "react-router-dom";
import { DropdownButton, MenuItem, Button } from "react-bootstrap";
import LogsTableView from "./LogsTableView";
import LogsJsonView from "./LogsJsonView";
import { getLogsPerPage } from "../util/LogsApi";
import Pages from "./Pages";

export default class LogsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: [],
      pagesCount: 0,
      currentPage: 1,
      filterMenu: { eventKey: 0, value: "Filter By" },
      tableView: true
    };

    this.searchBy = "";

    this.filters = [
      {
        eventKey: 1,
        value: "Severity"
      },
      {
        eventKey: 2,
        value: "Time"
      },
      {
        eventKey: 3,
        value: "Process"
      },
      {
        eventKey: 4,
        value: "Message"
      },
      {
        eventKey: 5,
        value: "Host"
      }
    ];
  }

  componentWillMount() {
    this.fetchLogs(this.state.currentPage);
  }

  search = () => {
    // will be changed
    fetch(
      `https://localhost:3000/logs?` +
        `filterBy=${this.state.filterMenu.value}` +
        `&searchBy=${this.searchBy}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(res => this.setState({ logs: res }))
      .catch(err => console.error(err));
  };

  dropdownSelect = eventKey => {
    this.setState({
      filterMenu: this.filters.find(f => f.eventKey === eventKey)
    });
  };

  toggleView = () => {
    this.setState({ tableView: !this.state.tableView });
  };

  checkPage = page => {
    if (page < 1) {
      return 1;
    } else if (page > this.state.pagesCount) {
      return this.state.pagesCount;
    }

    return page;
  };

  fetchLogs = page => {
    getLogsPerPage(this.checkPage(page)).then(res => {
      this.setState({
        logs: res.data,
        pagesCount: res.count,
        currentPage: res.page
      });
    });
  };

  render() {
    const { logs, pagesCount, currentPage, filterMenu, tableView } = this.state;

    return (
      <div className="container" style={{ marginTop: "3%" }}>
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2">
            <div className="input-group">
              <div className="input-group-btn search-panel">
                <DropdownButton
                  onSelect={e => this.dropdownSelect(e)}
                  title={filterMenu.value}
                  key={4}
                  id={`dropdown-basic`}
                >
                  {this.filters.map((f, key) => (
                    <MenuItem key={key} eventKey={f.eventKey}>
                      {f.value}
                    </MenuItem>
                  ))}
                  <MenuItem divider />
                  <MenuItem eventKey="6" active>
                    Anything
                  </MenuItem>
                </DropdownButton>
              </div>
              <input
                type="hidden"
                name="search_param"
                value="all"
                id="search_param"
              />
              <input
                onChange={e => (this.searchBy = e.target.value)}
                type="text"
                className="form-control"
                name="x"
                placeholder="Search term..."
              />
              <span className="input-group-btn">
                <button
                  className="btn btn-default"
                  type="button"
                  onClick={this.search}
                >
                  <span className="glyphicon glyphicon-search" />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: "5%" }}>
          <div
            className="row"
            style={{
              marginVertical: "5px",
              marginLeft: "93%"
            }}
          >
            <Button bsSize="small" onClick={this.toggleView}>
              {tableView ? "JSON View" : "Table View"}
            </Button>
          </div>
          <br />
          {tableView ? (
            <LogsTableView logs={logs} />
          ) : (
            <LogsJsonView logs={logs} />
          )}
        </div>
        <Pages
          logs={logs}
          pagesCount={pagesCount}
          currentPage={currentPage}
          loadLogs={this.fetchLogs}
        />
      </div>
    );
  }
}
