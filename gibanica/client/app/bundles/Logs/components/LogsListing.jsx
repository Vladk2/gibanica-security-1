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
            <div>
                {
                    logs.map(log => {
                        console.log(log);
                    })
                }
            </div>
        )
    }
}