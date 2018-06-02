import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import CarouselGraph from "./CarouselGraph";
import NavBar from "./navbar/NavBar";
import LogsTableView from "./LogsTableView";
import LogsJsonView from "./LogsJsonView";
import { getLogsPerPage } from "../util/LogsApi";
import Pages from "./Pages";

export default class LogsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLogged: false,
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
      window.location.replace("/");
    } else {
      this.setState(
        {
          userLogged: true
        },
        () => {
          this.fetchLogs(this.state.currentPage);
        }
      );
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
    const {
      logs,
      pagesCount,
      currentPage,
      filterMenu,
      tableView,
      userLogged
    } = this.state;

    if (!userLogged) {
      return null;
    }
    return (
      <div
        className="container"
        style={{
          marginTop: "1%"
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

        <CarouselGraph />
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
            <label className="switch">
              <input type="checkbox" onClick={this.toggleView} />
              <span className="slider round" />
            </label>
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
