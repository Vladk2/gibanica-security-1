import React from "react";

import { getAlarmsPerPage } from "../util/AlarmsApi";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Title from "grommet/components/Title";
import CarouselGraph from "./CarouselGraph";
import Footer from "grommet/components/Footer";

import AlarmBox from "./common/AlarmBox";
import AlarmRuleForm from "./common/AlarmRuleForm";
import NavBar from "./navbar/NavBar";
import logo from "../assets/images/logo.png";

export default class AlarmsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alarms: undefined
    };
  }

  componentWillMount() {
    getAlarmsPerPage(1)
      .then(res => {
        if (res.status === 200) {
          this.setState({
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
      })
      .catch(error => console.log("error"));
  }

  toggleExpandAlarm = index => {
    const { alarms } = this.state;

    alarms[index].collapsed = !alarms[index].collapsed;

    this.setState({ alarms });
  };

  render() {
    const { alarms } = this.state;

    if (!alarms) {
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
          <CarouselGraph type="alarms" />
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
