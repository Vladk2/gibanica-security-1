import React from "react";

import { getAlarmsPerPage } from "../util/AlarmsApi";

import CarouselGraph from "./CarouselGraph";
import FooterBox from "./common/FooterBox";

import Pages from "./Pages";

import AlarmBox from "./common/AlarmBox";
import AlarmRuleForm from "./common/AlarmRuleForm";
import NavBar from "./navbar/NavBar";

export default class AlarmsListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pagesCount: 0,
      currentPage: 1,
      alarms: undefined
    };
  }

  componentWillMount() {
    this.fetchAlarms(this.state.currentPage);
  }

  toggleExpandAlarm = index => {
    const { alarms } = this.state;

    alarms[index].collapsed = !alarms[index].collapsed;

    this.setState({ alarms });
  };

  checkPage = page => {
    if (page < 1) {
      return 1;
    } else if (this.state.pagesCount !== 0 && page > this.state.pagesCount) {
      return this.state.pagesCount;
    }

    return page;
  };

  fetchAlarms = page => {
    getAlarmsPerPage(this.checkPage(page))
      .then(res => {
        if (res.status === 200) {
          this.setState({
            currentPage: res.data.page,
            pagesCount: Math.ceil(res.data.count / 6),
            alarms: res.data.alarms.map(
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
      .catch(error => console.log(error));
  };

  render() {
    const { alarms, pagesCount, currentPage } = this.state;

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
        <Pages
          pagesCount={pagesCount}
          currentPage={currentPage}
          load={this.fetchAlarms}
        />
        <br />
        <br />
        <div>
          <FooterBox />
        </div>
      </div>
    );
  }
}
