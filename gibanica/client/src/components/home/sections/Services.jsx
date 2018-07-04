import React from "react";

export default class Services extends React.Component {
  render() {
    return (
      <section id="services">
        <div className="container">
          <div className="section-header">
            <h2>Services</h2>
            <p>
              You don't know what is happening with your system? Is it working
              like it should ? Well don't worry, we provide fast, efficient and
              secured tools for processing your system, application and firewall
              logs. You may also add custom formats to agent configuration for
              any logs you want to send to our database.
            </p>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="box wow fadeInLeft">
                <div className="icon">
                  <i className="fa fa-database" />
                </div>
                <h4 className="title">
                  <a>Logs submitting and searching</a>
                </h4>
                <p className="description">
                  Deploy quickly. Fetch your data effectively.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="box wow fadeInRight">
                <div className="icon">
                  <i className="fa fa-bar-chart" />
                </div>
                <h4 className="title">
                  <a>Data analyzing</a>
                </h4>
                <p className="description">
                  Graph representations for many log related info.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="box wow fadeInLeft" data-wow-delay="0.2s">
                <div className="icon">
                  <i className="fa fa-shield" />
                </div>
                <h4 className="title">
                  <a>Your data is safe</a>
                </h4>
                <p className="description">Let us handle the security.</p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="box wow fadeInRight" data-wow-delay="0.2s">
                <div className="icon">
                  <i className="fa fa-clock-o" />
                </div>
                <h4 className="title">
                  <a>Alarms, alarms everywhere.</a>
                </h4>
                <p className="description">
                  Stay informed. Always be in touch with your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
