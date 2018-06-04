import React from "react";
import {
  DropdownButton,
  MenuItem,
  Popover,
  OverlayTrigger
} from "react-bootstrap";

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterMenu: {
        eventKey: 0,
        value: "All Time"
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
    // will be changed this.props.updateLogs();
  };

  dropdownSelect = eventKey => {
    this.setState({
      filterMenu: this.filters.find(f => f.eventKey === eventKey)
    });
  };

  render() {
    const { filterMenu } = this.state;

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
            <i>{"{severity: WARNING*}, ..., {process: apache-server[1298]}"}</i>
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
        </div>
      </div>
    );
  }
}
