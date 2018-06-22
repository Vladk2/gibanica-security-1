import React from "react";

import LinkBottomIcon from "grommet/components/icons/base/LinkBottom";
import LinkTopIcon from "grommet/components/icons/base/LinkTop";
import AlertIcon from "grommet/components/icons/base/Alert";
import Carousel from "grommet/components/Carousel";

import { Collapse } from "react-collapse";

import NavBar from "./navbar/NavBar";

export default class Alarms extends React.Component {
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
          <div className="row" key={i} style={{ textAlign: "center" }}>
            <div className="col-md-12">
              <div className="row">
                <div
                  className="col-md-9"
                  style={{
                    backgroundColor: "#EAFFF1",
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    height: window.innerHeight / 7
                  }}
                >
                  <div className="col-md-3">
                    <AlertIcon colorIndex="critical" size="large" />
                  </div>
                  <div className="col-md-9">
                    <p>Alarm {a.alarm}</p>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  style={{
                    backgroundColor: "#80D39C",
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    height: window.innerHeight / 7
                  }}
                >
                  <div>
                    <i>Latest alarm logs</i>
                  </div>
                  <div>
                    {a.collapsed ? (
                      <LinkTopIcon
                        onClick={() => this.toggleExpandAlarm(i)}
                        colorIndex="light-2"
                      />
                    ) : (
                      <LinkBottomIcon
                        onClick={() => this.toggleExpandAlarm(i)}
                        colorIndex="light-2"
                      />
                    )}
                  </div>
                </div>
              </div>
              <Collapse isOpened={a.collapsed}>
                <Carousel style={{ height: window.innerHeight / 4 }}>
                  <p>Log 1 from Alarm {a.alarm}</p>
                  <p>Log 2 from Alarm {a.alarm}</p>
                  <p>Log 3 from Alarm {a.alarm}</p>
                  <p>Log 4 from Alarm {a.alarm}</p>
                  <p>Log 5 from Alarm {a.alarm}</p>
                </Carousel>
              </Collapse>
              <br />
            </div>
          </div>
        ))}
      </div>
    );
  }
}
