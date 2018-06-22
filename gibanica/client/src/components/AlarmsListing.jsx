import React from "react";
import { getAlarmsPerPage } from "../util/AlarmsApi";
import Select from "grommet/components/Select";
import TextInput from 'grommet/components/TextInput';
import AddIcon from 'grommet/components/icons/base/Add';
import Button from "grommet/components/Button";
import DateTime from 'grommet/components/DateTime';

import AlarmBox from "./common/AlarmBox";
import NavBar from "./navbar/NavBar";

export default class AlarmsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alarms: []
    };
  }

  componentWillMount() {
    getAlarmsPerPage(1).then(res => {
      if (res.status === 200) {
        this.setState({
          alarms: res.data.map(e => e={name:e.name, message:e.message, created_at:e.created_at, collapsed:false})
        })
      }
    }).catch(error => console.log("error"));
  }

  toggleExpandAlarm = index => {
    const { alarms } = this.state;

    alarms[index].collapsed = !alarms[index].collapsed;

    this.setState({ alarms });
  };

  render() {
    const { alarms } = this.state;

    return (
      <div
        className="container"
        style={{
          marginTop: "1%"
        }}
      >
        <NavBar />
        <br />
        <div className="row">
        <div className="col-md-3">
          <Select placeHolder='None'
          inline={false}
          multiple={false}
          onSearch={false}
          options={['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']}
          value={undefined}/>
          </div>
          <div className="col-md-6">
          <TextInput style={{width:"100%"}} id='item1'
            name='item-1'
            value='one'
            suggestions={['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']} />
          </div>
          <div className="col-md-3">
          <Button
                  style={{
                    borderColor: "#33aca8"
                  }}
                  fill
                  label="Save"
                  type="submit"
                  icon={<AddIcon />}
                />
          </div>
        </div>
        <br/>
        <div className="row">
                  <div className="col-md-3">
                  <DateTime id='id1'
                  name='name'/>
                  </div>
                  <div className="col-md-3">
                  <DateTime id='id2'
                  name='name'/>
                  </div>
                  <div className="col-md-6">

                  </div>
        </div>
        <br/>

        {alarms.map((a, i) => (
          <AlarmBox
            key={i}
            index={i}
            alarm={a}
            toggleExpandAlarm={this.toggleExpandAlarm}
          />
        ))}
      </div>
    );
  }
}
