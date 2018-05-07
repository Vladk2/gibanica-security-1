import React from 'react';
import { Router, Link } from 'react-router-dom';

export default class LogsListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: this.props.logs,
        }
    }

    componentWillMount() {

    }

    render() {
        const { logs } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        A simple primary alert—check it out!
                    </div>
                    <div className="col-md-6">
                        <button type="button" className="btn btn-primary">
                          Notifications <span className="badge badge-light">4</span>
                        </button>
                    </div>
                </div>
                {
                    logs.map(log => {
                        //console.log(log);
                    })
                }
            </div>
        )
    }
}
