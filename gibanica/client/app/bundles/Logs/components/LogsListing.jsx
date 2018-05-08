import React from 'react';
import { Router, Link } from 'react-router-dom';
import { DropdownButton, MenuItem } from 'react-bootstrap';


export default class LogsListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: this.props.logs,
            filterMenu: { eventKey: 0, value: 'Filter By' },
        }

        this.filters = [
            {
                eventKey: 1,
                value: 'Severity'
            },
            {
                eventKey: 2,
                value: 'Time'
            },
            {
                eventKey: 3,
                value: 'Process'
            },
            {
                eventKey: 4,
                value: 'Message'
            },
            {
                eventKey: 5,
                value: 'Host'
            },
        ]
    }

    componentWillMount() {

    }

    search = () => {

    }

    filter = (filter) => {
        this.search();
    }

    toggleMenu = () => {
        this.setState({ showFilterMenu: !this.state.showFilterMenu });
    }

    dropdownSelect = (eventKey) => {
        this.setState({
            filterMenu: this.filters.find(f => f.eventKey === eventKey)
        });
    }

    render() {
        const { logs, showFilterMenu, filterMenu } = this.state;
        return (
            <div className="container" style={{ marginTop: '3%' }}>
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
                                    {
                                        this.filters.map((f, key) =>
                                            <MenuItem
                                                key={key}
                                                eventKey={f.eventKey}
                                            >
                                                {f.value}
                                            </MenuItem>
                                        )
                                    }
                                    <MenuItem divider />
                                    <MenuItem eventKey="6" active>Anything</MenuItem>
                                </DropdownButton>
                            </div>
                            <input type="hidden" name="search_param" value="all" id="search_param" />
                            <input type="text" className="form-control" name="x" placeholder="Search term..." />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="button" onClick={this.search}>
                                    <span className="glyphicon glyphicon-search"></span>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '5%' }}>
                    <div style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' }}>
                        {
                            logs.map(log => {
                                return (
                                    <p>{ log }</p>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
