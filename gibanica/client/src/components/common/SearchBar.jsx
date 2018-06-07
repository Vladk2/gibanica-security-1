import React from "react";
import {
  Popover,
  OverlayTrigger,
  Alert,
  DropdownButton,
  MenuItem
} from "react-bootstrap";
import SearchBadges from "./SearchBadges";
import { searchLogs } from "../../util/LogsApi";

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      badges: [],
      searchBy: "",
      filterMenu: {
        eventKey: 1,
        value: "Severity",
        showAlert: false
      }
    };

    this.filters = [
      {
        eventKey: 1,
        value: "Severity"
      },
      {
        eventKey: 2,
        value: "Host"
      },
      {
        eventKey: 3,
        value: "Process"
      },
      {
        eventKey: 4,
        value: "Message"
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
    const filter = this.filters.find(f => f.eventKey === eventKey);
    const { searchBy } = this.state;

    if (searchBy) {
      if (this.state.badges.find(b => b.filter === filter.value)) {
        const badges_copy = this.state.badges;

        const badge_index = badges_copy.findIndex(
          b => b.filter === filter.value
        );

        badges_copy[badge_index].search = searchBy;

        this.setState({
          badges: badges_copy,
          filterMenu: filter,
          searchBy: ""
        });
      } else {
        this.setState({
          filterMenu: filter,
          badges: [
            ...this.state.badges,
            { filter: filter.value, search: searchBy }
          ],
          searchBy: ""
        });
      }
    }
    this.setState({ filterMenu: filter });
  };

  // fix duplicated code !!!
  addBadge = () => {
    const { badges, filterMenu, searchBy } = this.state;

    if (badges.find(b => b.filter === filterMenu.value)) {
      const badges_copy = this.state.badges;

      const badge_index = badges_copy.findIndex(
        b => b.filter === filterMenu.value
      );

      badges_copy[badge_index].search = searchBy;

      this.setState({
        badges: badges_copy,
        searchBy: ""
      });
    } else {
      this.setState({
        badges: [
          ...this.state.badges,
          { filter: filterMenu.value, search: searchBy }
        ],
        searchBy: ""
      });
    }
  };

  removeBadge = badge_index => {
    const badges_copy = this.state.badges;
    badges_copy.splice(badge_index, 1);
    this.setState({ badges: badges_copy });
  };

  render() {
    const { badges, showAlert, searchBy, filterMenu } = this.state;
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
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="input-group input-group-lg">
              <span className="input-group-btn">
                <DropdownButton
                  bsSize="large"
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
                </DropdownButton>
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
                  value={searchBy}
                  onChange={e => this.setState({ searchBy: e.target.value })}
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
                  onClick={this.addBadge}
                >
                  <span className="glyphicon glyphicon-plus" />
                </button>
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
        <br />
        <SearchBadges badges={badges} removeBadge={this.removeBadge} />
      </div>
    );
  }
}
