import React from "react";

import LinkBottomIcon from "grommet/components/icons/base/LinkBottom";
import LinkTopIcon from "grommet/components/icons/base/LinkTop";
import AlertIcon from "grommet/components/icons/base/Alert";
import Carousel from "grommet/components/Carousel";
import Meter from "grommet/components/Meter";
import Box from "grommet/components/Box";
import Value from "grommet/components/Value";

import { Collapse } from "react-collapse";

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
          <div
            className="row"
            key={i}
            style={{ textAlign: "center", verticalAlign: "middle" }}
          >
            <div className="col-md-12">
              <div className="row">
                <div
                  className="col-md-9"
                  style={{
                    borderLeftWidth: 0.5,
                    borderLeftColor: "#CFCFCF",
                    borderLeftStyle: "solid",
                    backgroundColor: "#FFFFFF",
                    height: window.innerHeight / 7
                  }}
                >
                  <div
                    className="col-md-3"
                    style={{
                      position: "relative",
                      top: "50%",
                      transform: "translateY(-50%)"
                    }}
                  >
                    <AlertIcon colorIndex="critical" size="large" />
                  </div>
                  <div
                    className="col-md-9"
                    style={{
                      position: "relative",
                      top: "50%",
                      transform: "translateY(-50%)"
                    }}
                  >
                    <p>Alarm {a.alarm}</p>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  style={{
                    margin: "auto",
                    borderLeftWidth: 0.5,
                    borderLeftColor: "#CFCFCF",
                    borderLeftStyle: "solid",
                    borderRightWidth: 0.5,
                    borderRightColor: "#CFCFCF",
                    borderRightStyle: "solid",
                    backgroundColor: "#FFFFFF",
                    height: window.innerHeight / 7
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      top: "50%",
                      transform: "translateY(-50%)"
                    }}
                  >
                    <div>
                      <Box>
                        <Value value={1000} units="logs" align="start" />
                        <Meter vertical={false} value={40} />
                      </Box>
                    </div>
                    <div>
                      <i>Latest alarm logs</i>
                    </div>
                    <div>
                      {a.collapsed ? (
                        <LinkTopIcon
                          onClick={() => this.toggleExpandAlarm(i)}
                          colorIndex="neutral-4"
                        />
                      ) : (
                        <LinkBottomIcon
                          onClick={() => this.toggleExpandAlarm(i)}
                          colorIndex="neutral-4"
                        />
                      )}
                    </div>
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
