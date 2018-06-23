import React from "react";
import { getAlarmsPerPage } from "../util/AlarmsApi";
import Select from "grommet/components/Select";
import TextInput from "grommet/components/TextInput";
import AddIcon from "grommet/components/icons/base/Add";
import Button from "grommet/components/Button";
import DateTime from "grommet/components/DateTime";
import FormField from "grommet/components/FormField";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Title from "grommet/components/Title";
import Anchor from "grommet/components/Anchor";
import Menu from "grommet/components/Menu";
import Footer from "grommet/components/Footer";

import AlarmBox from "./common/AlarmBox";
import NavBar from "./navbar/NavBar";
import logo from "../assets/images/logo.png";

export default class AlarmsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alarms: []
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
                  name: e.name,
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
            <FormField>
              <TextInput
                style={{ width: "100%" }}
                id="item1"
                name="item-1"
                placeHolder="Title"
              />
            </FormField>
          </div>
          <div className="col-md-6">
            <FormField>
              <TextInput
                style={{ width: "100%" }}
                id="item1"
                name="item-1"
                placeHolder="Message"
              />
            </FormField>
          </div>
          <div className="col-md-3">
            <Button
              style={{
                borderColor: "#33aca8"
              }}
              fill
              plain
              label="Save"
              type="submit"
              icon={<AddIcon />}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-3">
            <FormField label="Match By">
              <Select
                inline={false}
                multiple={false}
                options={["severity", "host", "process", "message"]}
                value={undefined}
              />
            </FormField>
          </div>
          <div className="col-md-6">
            <FormField label="Rule goes here">
              <TextInput style={{ width: "100%" }} id="item1" name="item-1" />
            </FormField>
          </div>
          <div className="col-md-3">
            <FormField label="Count (Optional)">
              <TextInput />
            </FormField>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-3">
            <FormField label="Start Date">
              <DateTime format="D/M/YYYY" />
            </FormField>
          </div>
          <div className="col-md-3">
            <FormField label="End Date">
              <DateTime format="D/M/YYYY" />
            </FormField>
          </div>
          <div className="col-md-3">
            <FormField label="Start Time">
              <DateTime name="name" format="H:mm:ss" />
            </FormField>
          </div>
          <div className="col-md-3">
            <FormField label="End Time">
              <DateTime name="name" format="H:mm:ss" />
            </FormField>
          </div>
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
