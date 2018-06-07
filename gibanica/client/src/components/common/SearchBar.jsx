import React from "react";
import { Popover, OverlayTrigger, Alert } from "react-bootstrap";
import { searchLogs } from "../../util/LogsApi";

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterMenu: {
        eventKey: 0,
        value: "All Time",
        showAlert: false
      }
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

  search = () => {
    if (!this.queryValid()) {
      this.setState({ showAlert: true });
    } else {
      this.setState({ showAlert: false }, () => {
        // send query
        searchLogs(encodeURIComponent(this.searchBy.trim()), 0).then(res => {
          console.log(res);
        });
      });
    }
  };

  queryValid = () => {
    // {severity: ERROR|INFO}
    // {severity: ERROR|INFO} or [{host: notebook}, {process: gnome.shell}]
    const rule_one = new RegExp(
      "^\\s*({\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*" +
        "(,\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*)*)?" +
        "(\\s*or\\s*\\[\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*" +
        "(,\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*})*\\s*\\])?\\s*$"
    ).test(this.searchBy);

    // or [{host: notebook}, {process: gnome.shell}], {severity: ERROR|INFO}
    // or [{host: notebook}, {process: gnome.shell}]
    const rule_two = new RegExp(
      "^(\\s*or\\s*\\[\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*" +
        "(,\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*})*\\s*\\]\\s*)" +
        "(,\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*)*$"
    ).test(this.searchBy);

    // {message: installed} or [{host: notebook}, {process: gnome.shell}], {severity: ERROR|INFO}
    const rule_three = new RegExp(
      "^\\s*({\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*" +
        "(,\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*)*)?" +
        "(\\s*or\\s*\\[\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*" +
        "(,\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*})*\\s*\\])\\s*" +
        "(,\\s*{\\s*(severity|message|process|host)\\s*:\\s*[^}]*\\s*}\\s*)*$"
    ).test(this.searchBy);

    return rule_one || rule_two || rule_three;
  };

  dropdownSelect = eventKey => {
    this.setState({
      filterMenu: this.filters.find(f => f.eventKey === eventKey)
    });
  };

  render() {
    const { filterMenu, showAlert } = this.state;

    const popoverHoverFocus = (
      <Popover
        id="popover-trigger-hover-focus"
        title="Query Examples"
        style={{
          maxWidth: "100%"
        }}
      >
        <div
          style={{
            width: 1000
          }}
        >
          <p>
            <i>{"{severity: WARNING}, ..., {process: apache-server[1298]}"}</i>
          </p>
          <p>
            <i>{"or [{severity : ERROR|ALERT}, ..., {host : notebook}]"}</i>
          </p>
          <p>
            <i>
              {
                "{message: [a-z]*}, {process: [0-9]+} or [{severity : WARNING|INFO}, ..., {host : local-pc}]"
              }
            </i>
          </p>
        </div>
      </Popover>
    );

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="input-group input-group-lg" style={{ height: "10%" }}>
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                type="button"
                onClick={this.search}
              >
                {filterMenu.value}
              </button>
            </span>
            <input
              type="hidden"
              name="search_param"
              value="all"
              id="search_param"
            />
            <OverlayTrigger
              trigger={["focus"]}
              placement="bottom"
              overlay={popoverHoverFocus}
            >
              <input
                onFocus={this.toggleQueryTips}
                onBlur={this.toggleQueryTips}
                onChange={e => (this.searchBy = e.target.value)}
                type="text"
                className="form-control"
                name="x"
                placeholder="Search term..."
              />
            </OverlayTrigger>
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
          {showAlert ? (
            <div>
              <br />
              <Alert bsStyle="warning">
                <strong>Query not valid!</strong> Carefully create your query
                following examples in tool-tip box.
              </Alert>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
