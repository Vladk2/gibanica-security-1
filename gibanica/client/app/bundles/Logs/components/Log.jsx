import React from 'react';

class Log extends React.Component{

  constructor(props){
    super(props);
  }

  componentWillMount = () => {
    //this.log = this.props.log;
  }

  parseDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate.toDateString();
  }

  render() {
    let { log } = this.props;
    log = JSON.parse(log);

    return(
      <div className="row">
        <div className="col-md-2">
          { this.parseDate(log.logged_time) }
        </div>
        <div className="col-md-10">
          <p>{ log.severity }</p>
          <p>{ log.host }</p>
          <p>{ log.process }</p>
          <p>{ JSON.stringify(log.message) }</p>
        </div>
      </div>
    )
  }


}
export default Log;