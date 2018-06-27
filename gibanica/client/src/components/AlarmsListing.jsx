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
      alarms: undefined,
      logsCount: 0
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
            currentPage: res.data.data.page,
            pagesCount: Math.ceil(res.data.data.count / 6),
            alarms: res.data.data.alarms.map(
              e =>
                (e = {
                  host: e.host,
                  message: e.message,
                  created_at: e.created_at,
                  logsCount: e.logs_count,
                  collapsed: false
                })
            ),
            logsCount: res.data.logs_count
          });
        }
      })
      .catch(error => console.log(error));
  };

  render() {
    const { alarms, pagesCount, currentPage, logsCount } = this.state;

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
                logsCount={logsCount}
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
