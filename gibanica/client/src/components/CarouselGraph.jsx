import React from "react";
import { Carousel } from "react-bootstrap";
import {
  getNumberOfLogsInsertedPerDay,
  getNumberOfLogsInsertedPerHost
} from "../util/LogsApi";
import Graph from "./Graph";

export default class CarouselGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataDays: undefined,
      dataHost: undefined
    };
  }

  componentWillMount() {
    getNumberOfLogsInsertedPerDay(30).then(res_days => {
      getNumberOfLogsInsertedPerHost().then(res_host => {
        this.setState({ dataDays: res_days, dataHost: res_host });
      });
    });
  }

  render() {
    const { dataDays, dataHost } = this.state;

    if (!dataDays || !dataHost) {
      return null;
    }

    return (
      <div
        style={{
          boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.51)",
          background:
            "linear-gradient(to top, #CBCBCB, #CBCBCB, #E7E7E7, #F5F5F5, white, white, white)"
        }}
      >
        <Carousel controls={false} interval={5000}>
          <Carousel.Item>
            <Graph type="days" data={dataDays} />
          </Carousel.Item>
          <Carousel.Item>
            <Graph type="host" data={dataHost} />
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}
