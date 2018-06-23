import React from "react";
import CarouselGraph from "./CarouselGraph";
import LogsTableView from "./LogsTableView";
import SearchBar from "./common/SearchBar";
import NavBar from "./navbar/NavBar";
import LogsJsonView from "./LogsJsonView";
import { getLogsPerPage, searchLogs } from "../util/LogsApi";
import Pages from "./Pages";

export default class LogsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLogged: false,
      logs: [],
      pagesCount: 0,
      currentPage: 1,
      tableView: true,
      search_query: ""
    };
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

  updatePage = page => this.setState({ currentPage: page });

  updateLogs = logs => this.setState({ logs });

  updatePagesCount = count => this.setState({ pagesCount: count });

  updateSearchQuery = query => (this.search_query = query);

  fetchLogs = page => {
    getLogsPerPage(this.checkPage(page)).then(res => {
      if (res && res.status === 200) {
        this.setState({
          logs: res.data.data,
          pagesCount: Math.ceil(res.data.count / 20),
          currentPage: res.data.page
        });
      }
    });
  };

  searchPerPage = (query, page) => {
    searchLogs(query, page).then(res => {
      if (res.status === 200) {
        this.setState({
          logs: res.data.data,
          currentPage: res.data.page,
          pagesCount: Math.ceil(res.data.count / 20),
          search_query: query
        });
      }
    });
  };

  searchWithExistingQuery = () => {};

  render() {
    const {
      logs,
      pagesCount,
      currentPage,
      tableView,
      userLogged,
      search_query
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
        <SearchBar
          searchPerPage={this.searchPerPage}
          page={currentPage}
          updateLogs={this.updateLogs}
          updatePage={this.updatePage}
          updatePagesCount={this.updatePagesCount}
        />
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
          query={search_query}
          searchPerPage={this.searchPerPage}
          pagesCount={pagesCount}
          currentPage={currentPage}
          loadLogs={this.fetchLogs}
        />
      </div>
    );
  }
}
