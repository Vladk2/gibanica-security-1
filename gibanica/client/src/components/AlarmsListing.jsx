import React from "react";

import {
  getAlarmsPerPage,
  getAlarmsCount,
  getAlarmsCountPerHost
} from "../util/AlarmsApi";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Title from "grommet/components/Title";
import Carousel from "grommet/components/Carousel";
import Footer from "grommet/components/Footer";

import AlarmBox from "./common/AlarmBox";
import AlarmRuleForm from "./common/AlarmRuleForm";
import NavBar from "./navbar/NavBar";
import logo from "../assets/images/logo.png";

import Graph from "./Graph";

export default class AlarmsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      system_count: undefined,
      host_count: undefined,
      alarms: undefined
    };
  }

  componentWillMount() {
    getAlarmsPerPage(1)
      .then(res => {
        if (res.status === 200) {
          getAlarmsCount().then(res_sys_count => {
            if (res_sys_count.status === 200) {
              getAlarmsCountPerHost().then(res_host_count => {
                if (res_host_count.status === 200) {
                  this.setState({
                    system_count: res_sys_count,
                    host_count: res_host_count,
                    alarms: res.data.map(
                      e =>
                        (e = {
                          host: e.host,
                          message: e.message,
                          created_at: e.created_at,
                          collapsed: false
                        })
                    )
                  });
                }
              });
            }
          });
        }
      })
      .catch(error => console.log("error"));
  }

  toggleExpandAlarm = index => {
    const { alarms } = this.state;

    alarms[index].collapsed = !alarms[index].collapsed;

    this.setState({ alarms });
  };

  render() {
    const { alarms, system_count, host_count } = this.state;

    if (!alarms || !system_count || !host_count) {
      return null;
    }

    return (
      <div
        className="container"
        style={{
          marginTop: "1%"
        }}
      >
        <NavBar />
        <br />
        <AlarmRuleForm />
        <br />
        <div>
          <Carousel style={{ height: window.innerHeight / 4 }}>
            <Graph type="alarms_host" data={host_count} />
            <Graph type="alarms_system" data={system_count} />
          </Carousel>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div className="row">
          <div className="col-md-12">
            {alarms.map((a, i) => (
              <AlarmBox
                key={i}
                index={i}
                alarm={a}
                toggleExpandAlarm={this.toggleExpandAlarm}
              />
            ))}
          </div>
        </div>
        <br />
        <br />
        <div>
          <Footer justify="between" size="small">
            <Title>
              <img src={logo} alt="" width={80} height={45} />
            </Title>
            <Box direction="row" align="center" pad={{ between: "medium" }}>
              <Paragraph margin="none">© 2018 Gibanica Security</Paragraph>
            </Box>
          </Footer>
        </div>
      </div>
    );
  }
}
