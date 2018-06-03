import React from "react";
import moment from "moment";
import { Bar } from "react-chartjs-2";

export default class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };

    this.options = {
      scales: {
        yAxes: [
          {
            ticks: {
              stepSize: this.props.type === "days" ? 0 : 1,
              display: true
            }
          }
        ]
      }
    };
  }

  componentWillMount() {
    const type = this.props.type;

    if (type === "days") {
      this.data = {
        labels: this.last_month_dates(),
        datasets: [
          {
            label: "Number of Logs Submitted Per Day",
            backgroundColor: "#669999",
            borderColor: "#ffffff",
            data: Array(30).fill(0)
          }
        ]
      };

      this.parseGraphDataPerDay(this.props.data.data);
    } else if (type === "host") {
      this.data = {
        labels: [],
        datasets: [
          {
            label: "Number of Logs Submitted Per Machine",
            backgroundColor: "#669999",
            borderColor: "#ffffff",
            data: []
          }
        ]
      };

      this.parseGraphDataPerHost(this.props.data.data);
    }
  }

  parseGraphDataPerDay = data => {
    this.data.labels.forEach((e, i) => {
      const found = data.find(c => moment(c._id).format("DD-MM-YYYY") === e);

      if (found) {
        this.data.datasets[0].data[i] = found.count;
      }
    });

    this.setState({ loaded: true });
  };

  parseGraphDataPerHost = data => {
    data.forEach(e => {
      this.data.labels.push(e._id);
      this.data.datasets[0].data.push(e.count);
    });

    this.setState({ loaded: true });
  };

  last_month_dates = () => {
    const startDate = moment().subtract(30, "days");
    const endDate = moment();

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day.format("DD-MM-YYYY"));
      day = day.add(1, "days");
    }

    return days;
  };

  render() {
    const { loaded } = this.state;

    return (
      <div>
        {loaded ? (
          <div
            style={{
              paddingTop: "1%"
            }}
          >
            <Bar
              data={this.data}
              height={window.innerHeight / 20}
              options={this.options}
            />
            <div
              style={{
                paddingTop: "7%"
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
