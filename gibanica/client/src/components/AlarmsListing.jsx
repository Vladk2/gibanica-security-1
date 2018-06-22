import React from "react";

import AlarmBox from "./common/AlarmBox";
import NavBar from "./navbar/NavBar";

export default class AlarmsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alarms: [
        { collapsed: false, alarm: 1 },
        { collapsed: false, alarm: 4 },
        { collapsed: false, alarm: 3 },
        { collapsed: false, alarm: 2 }
      ]
    };
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
