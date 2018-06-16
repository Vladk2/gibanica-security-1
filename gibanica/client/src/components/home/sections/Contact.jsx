import React from "react";

export default class Contact extends React.Component {
  render() {
    return (
      <section id="contact" className="wow fadeInUp">
        <div className="container">
          <div className="section-header">
            <h2>Contact Us</h2>
            <p>
              We're ready to lead you into the future of log analyzing. Our
              customer support services are the best in the business, with a 99%
              customer satisfaction rating (don't ask us how we know this).
            </p>
          </div>

          <div className="row contact-info">
            <div className="col-md-4">
              <div className="contact-address">
                <i className="ion-ios-location-outline" />
                <h3>Address</h3>
                <address>99 Braće Krkljuš, Novi Sad 21000, Serbia</address>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-phone">
                <i className="ion-ios-telephone-outline" />
                <h3>Phone Number</h3>
                <p>
                  <a href="tel:+381 21 777 555">+381 21 777 555</a>
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-email">
                <i className="ion-ios-email-outline" />
                <h3>Email</h3>
                <p>
                  <a href="mailto:gibanica-security@info.com">
                    gibanica-security@info.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
