import React from "react";
import { DropdownButton, MenuItem, Button } from "react-bootstrap";
import { Bar, HorizontalBar, Radar, Line } from "react-chartjs-2";
import LogsTableView from "./LogsTableView";
import LogsJsonView from "./LogsJsonView";
import NavBar from "./navbar/NavBar";
import { getLogsPerPage } from "../util/LogsApi";
import Pages from "./Pages";

export default class LogsListing extends React.Component {
  constructor(props) {
    super(props);

    this.data = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July"
      ],
      datasets: [
        {
          label: "Number of logs submitted",
          backgroundColor: "#669999",
          borderColor: "#ffffff",
          data: [65, 59, 80, 81, 56, 55, 3, 65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };

    this.state = {
      logs: [],
      pagesCount: 0,
      currentPage: 1,
      filterMenu: {
        eventKey: 0,
        value: "All Time"
      },
      tableView: true
    };

    this.searchBy = "";

    this.filters = [
      {
        eventKey: 1,
        value: "Last Hour"
      },
      {
        eventKey: 2,
        value: "Today"
      },
      {
        eventKey: 3,
        value: "Last 7 Days"
      },
      {
        eventKey: 4,
        value: "Last Month"
      },
      {
        eventKey: 5,
        value: "Last Year"
      },
      {
        eventKey: 6,
        value: "Date Range"
      }
    ];
  }

  componentWillMount() {
    if (!localStorage.getItem("token")) {
      window.location.assign("/");
    } else {
      this.fetchLogs(this.state.currentPage);
    }
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
    this.setState({
      tableView: !this.state.tableView
    });
  };

  checkPage = page => {
    if (page < 1) {
      return 1;
    } else if (this.state.pagesCount !== 0 && page > this.state.pagesCount) {
      return this.state.pagesCount;
    }

    return page;
  };

  fetchLogs = page => {
    getLogsPerPage(this.checkPage(page)).then(res => {
      this.setState({
        logs: res.data.data,
        pagesCount: Math.ceil(res.data.count / 20),
        currentPage: res.data.page
      });
    });
  };

  render() {
    const { logs, pagesCount, currentPage, filterMenu, tableView } = this.state;

    return (
      <div
        className="container"
        style={{
          marginTop: "3%"
        }}
      >
        <NavBar />
        <div className="row">
          <div className="col-md-12">
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
                  <MenuItem eventKey="0" active>
                    All Time
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
        <br />
        <Bar data={this.data} height={30} />
        <div
          className="row"
          style={{
            marginTop: "2%"
          }}
        >
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
          <br />{" "}
          {tableView ? (
            <LogsTableView logs={logs} />
          ) : (
            <LogsJsonView logs={logs} />
          )}
        </div>
        <Pages
          pagesCount={pagesCount}
          currentPage={currentPage}
          loadLogs={this.fetchLogs}
        />
      </div>
    );
  }
}
