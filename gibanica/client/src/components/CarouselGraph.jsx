import React from "react";

import Carousel from "grommet/components/Carousel";

import {
  getNumberOfLogsInsertedPerDay,
  getNumberOfLogsInsertedPerHost,
  getNumberOfLogsInserted
} from "../util/LogsApi";

import { getAlarmsCount, getAlarmsCountPerHost } from "../util/AlarmsApi";

import Graph from "./Graph";

export default class CarouselGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logs_day_count: undefined,
      logs_host_count: undefined,
      logs_system_count: undefined,
      alarms_system_count: undefined,
      alarms_host_count: undefined
    };
  }

  componentWillMount() {
    const { type } = this.props;

    if (type === "logs") {
      getNumberOfLogsInserted().then(res_sys => {
        getNumberOfLogsInsertedPerDay(30).then(res_days => {
          getNumberOfLogsInsertedPerHost().then(res_host => {
            this.setState({
              logs_system_count: res_sys,
              logs_day_count: res_days,
              logs_host_count: res_host
            });
          });
        });
      });
    } else if (type === "alarms") {
      getAlarmsCount().then(res_sys_count => {
        if (res_sys_count.status === 200) {
          getAlarmsCountPerHost().then(res_host_count => {
            if (res_host_count.status === 200) {
              this.setState({
                alarms_system_count: res_sys_count,
                alarms_host_count: res_host_count
              });
            }
          });
        }
      });
    }
  }

  render() {
    const {
      logs_day_count,
      logs_system_count,
      logs_host_count,
      alarms_system_count,
      alarms_host_count
    } = this.state;

    const { type } = this.props;

    if (type === "logs") {
      if (!logs_day_count || !logs_host_count || !logs_system_count) {
        return null;
      }
    } else if (type === "alarms") {
      if (!alarms_host_count || !alarms_system_count) {
        return null;
      }
    }

    return (
      <div
        style={{
          boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.51)",
          background:
            "linear-gradient(to top, #EEEEEE, #EEEEEE, #EEEEEE, white, white, white, white)"
        }}
      >
        {type === "logs" ? (
          <Carousel style={{ height: window.innerHeight / 4 }}>
            <Graph type="days" data={logs_day_count} />
            <Graph type="host" data={logs_host_count} />
            <Graph type="system" data={logs_system_count} />
          </Carousel>
        ) : null}
        {type === "alarms" ? (
          <Carousel style={{ height: window.innerHeight / 4 }}>
            <Graph type="alarms_host" data={alarms_host_count} />
            <Graph type="alarms_system" data={alarms_system_count} />
          </Carousel>
        ) : null}
      </div>
    );
  }
}
