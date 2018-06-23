import React from "react";

import CaretDownIcon from "grommet/components/icons/base/CaretDown";
import CaretUpIcon from "grommet/components/icons/base/CaretUp";
import AlertIcon from "grommet/components/icons/base/Alert";
import Carousel from "grommet/components/Carousel";
import Meter from "grommet/components/Meter";
import Box from "grommet/components/Box";
import Value from "grommet/components/Value";
import Label from "grommet/components/Label";
import Heading from "grommet/components/Heading";
import Timestamp from "grommet/components/Timestamp";

import { Collapse } from "react-collapse";

export default class AlarmBox extends React.Component {
  render() {
    const { alarm, index, toggleExpandAlarm } = this.props;
    return (
      <div
        className="row"
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
                <Timestamp
                  value={new Date(alarm.created_at).toLocaleDateString()}
                />
              </div>
              <div
                className="col-md-9"
                style={{
                  position: "relative",
                  top: "50%",
                  transform: "translateY(-50%)"
                }}
              >
                <Heading tag="h3" align="center">
                  {alarm.name}
                </Heading>
                <p style={{ color: "gray" }}>{alarm.message}</p>
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
                  <Box align="center">
                    <Meter
                      label={
                        <div>
                          <Value value={40} />
                          <p>Logs</p>
                        </div>
                      }
                      size="xsmall"
                      type="circle"
                      max={1000}
                      value={40}
                    />
                    <Box
                      direction="row"
                      justify="between"
                      align="center"
                      pad={{ between: "small" }}
                      responsive={false}
                    >
                      <Label size="small">0</Label>
                      <Label size="small">1000</Label>
                    </Box>
                  </Box>
                </div>
                <div style={{ paddingTop: 10 }}>
                  {alarm.collapsed ? (
                    <CaretUpIcon
                      onClick={() => toggleExpandAlarm(index)}
                      colorIndex="neutral-4"
                    />
                  ) : (
                    <CaretDownIcon
                      onClick={() => toggleExpandAlarm(index)}
                      colorIndex="neutral-4"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <Collapse isOpened={alarm.collapsed}>
            <Carousel style={{ height: window.innerHeight / 4 }}>
              <p>Log 1 from Alarm {alarm.alarm}</p>
              <p>Log 2 from Alarm {alarm.alarm}</p>
              <p>Log 3 from Alarm {alarm.alarm}</p>
              <p>Log 4 from Alarm {alarm.alarm}</p>
              <p>Log 5 from Alarm {alarm.alarm}</p>
            </Carousel>
          </Collapse>
          <br />
          <br />
        </div>
      </div>
    );
  }
}
