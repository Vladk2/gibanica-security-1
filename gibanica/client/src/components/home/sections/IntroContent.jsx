import React from "react";
import bg_1 from "../../../assets/images/intro-carousel/1.jpg";
import bg_2 from "../../../assets/images/intro-carousel/2.jpg";
import bg_3 from "../../../assets/images/intro-carousel/3.jpg";
import bg_4 from "../../../assets/images/intro-carousel/4.jpg";

export default class IntroContent extends React.Component {
  constructor(props) {
    super(props);

    this.backgrounds = [bg_1, bg_2, bg_3, bg_4];
    this.currentIndex = 0;

    this.state = {
      background: this.backgrounds[0]
    };
  }

  tick() {
    if (this.currentIndex === 3) {
      this.currentIndex = 0;
    }

    this.setState(
      {
        background: this.backgrounds[this.currentIndex]
      },
      () => (this.currentIndex += 1)
    );
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { background } = this.state;
    const { loggedIn } = this.props;

    return (
      <section
        id="intro"
        style={{
          background: `url("${background}")`
        }}
      >
        <div className="intro-content">
          <h2>
            SIEM<span>security</span>
            <br />Analytics tool
          </h2>
          <div>
            <a
              href="https://github.com/foo4foo/gibanica-security/tree/development"
              className="btn-get-started scrollto"
            >
              Get Started
            </a>
            <a
              href={loggedIn ? "/logs" : null}
              style={{
                cursor: "pointer"
              }}
              className="btn-projects scrollto"
            >
              {loggedIn ? "Enter" : "Our Services"}
            </a>
          </div>
        </div>
      </section>
    );
  }
}
