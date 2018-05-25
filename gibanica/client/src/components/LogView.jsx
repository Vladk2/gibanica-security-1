import React from 'react';

export default class LogView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            log: this.props.log,
        }
    }

    render() {
        const { log } = this.state;
        return (
            <div>
                <p>
                <strong>Name:</strong>
                { log.name }
                </p>

                <p>
                <strong>Is Directory:</strong>
                { log.is_dir ? 'True' : 'False' }
                </p>

                <p>
                <strong>Directory path:</strong>
                { log.dir_path }
                </p>

                <p>
                <strong>User:</strong>
                { log.user }
                </p>

                <p>
                <strong>Agent:</strong>
                { log.agent }
                </p>

                <a href={`/logs`}>Back</a>
            </div>
        )
    }
}