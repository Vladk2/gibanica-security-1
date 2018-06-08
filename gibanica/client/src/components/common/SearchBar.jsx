import React from "react";
import {
  Popover,
  OverlayTrigger,
  DropdownButton,
  MenuItem
} from "react-bootstrap";
import SearchBadges from "./SearchBadges";
import DatePicker from "react-date-picker";
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      badges: [],
      dateStart: null,
      dateEnd: null,
      searchBy: "",
      filterMenu: {
        eventKey: 1,
        value: "Severity"
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
    const criteria = this.state.badges.splice();
    const { dateStart, dateEnd } = this.state;

    criteria.forEach(b => {
      b.filter = b.filter.toLowerCase();
    });

    if (dateStart) {
      criteria.push({
        filter: "logged_time_start",
        search: dateStart.toLocaleDateString("en-CA")
      });
    }

    if (dateEnd) {
      criteria.push({
        filter: "logged_time_end",
        search: dateEnd.toLocaleDateString("en-CA")
      });
    }

    const search_query_encoded = encodeURIComponent(JSON.stringify(criteria));

    this.props.searchPerPage(search_query_encoded, 0);
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

    if (!searchBy) {
      return;
    }

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

  onChangeDate = (date, type) => {
    if (type === "start") {
      this.setState({ dateStart: date });
    } else {
      this.setState({ dateEnd: date });
    }
  };

  render() {
    const { badges, searchBy, filterMenu, dateStart, dateEnd } = this.state;
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
          </div>
        </div>
        <br />
        <div className="row">
          <div
            className="col-md-12"
            style={{
              flex: 1,
              flexDirection: "row"
            }}
          >
            <DatePicker
              locale="en-au"
              onChange={d => this.onChangeDate(d, "start")}
              value={dateStart}
            />
            <DatePicker
              locale="en-au"
              onChange={d => this.onChangeDate(d, "end")}
              value={dateEnd}
            />
          </div>
        </div>
        <br />
        <SearchBadges badges={badges} removeBadge={this.removeBadge} />
      </div>
    );
  }
}
