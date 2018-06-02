import React from "react";
import { Carousel } from "react-bootstrap";
import Graph from "./Graph";

export default class CarouselGraph extends React.Component {
  isAdmin = () => {
    if (true) {
      return true;
    }

    return false;
  };

  render() {
    if (!this.isAdmin()) {
      return null;
    }

    return (
      <div
        style={{
          background:
            "linear-gradient(to top, #CBCBCB, #CBCBCB, #E7E7E7, #F5F5F5, white, white, white)"
        }}
      >
        <Carousel controls={false} interval={5000}>
          <Carousel.Item>
            <Graph type="days" />
          </Carousel.Item>
          <Carousel.Item>
            <Graph type="host" />
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}
