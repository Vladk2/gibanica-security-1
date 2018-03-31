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
                <h1>Logs</h1>
                <table>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Is Directory</th>
                        <th>Directory path</th>
                        <th>User</th>
                        <th>Agent</th>
                        <th colSpan = { 3 }></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            logs.map((log, key) => {
                                return (
                                    <tr key={ key }>
                                        <td>{ log.name }</td>
                                        <td>{ log.is_dir ? 'True' : 'False' }</td>
                                        <td>{ log.dir_path }</td>
                                        <td>{ log.user }</td>
                                        <td>{ log.agent }</td>
                                        <td><a href={`/logs/${log._id.$oid}`}>Show</a></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}