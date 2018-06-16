import React from "react";
import about_img from "../../../assets/images/about-img.jpg";

export default class About extends React.Component {
  constructor(props) {
    super(props);

    let todaysDate = new Date();
    todaysDate.setHours(0, 0, 0);

    this.state = {
      date: "2018-06-09 00:00"
    };
  }

  changeDate = date => {
    this.setState({ date });
  };

  render() {
    return (
      <section id="about" className="wow fadeInUp">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 about-img">
              <img src={about_img} alt="" />
            </div>

            <div className="col-lg-6 content">
              <br />
              <br />
              <h2>Turn Logs Into Simple Answers</h2>
              <br />
              <br />
              <h3>
                Gibanica-Security (GS) gives you real-time answers you need to
                meet your goals.
              </h3>
              <br />
              <ul>
                <li>
                  <i className="ion-android-checkmark-circle" />
                  Use our system to submit your log data and gain insights into
                  possible threats.
                </li>
                <li>
                  <i className="ion-android-checkmark-circle" />
                  GS scales to meet modern data needs - embrace the complexity,
                  get the answers.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
