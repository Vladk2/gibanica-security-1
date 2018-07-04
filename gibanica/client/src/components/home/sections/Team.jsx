import React from "react";
import team_1 from "../../../assets/images/team-1.jpg";
import team_2 from "../../../assets/images/team-2.jpg";
import team_3 from "../../../assets/images/team-3.jpg";
import team_4 from "../../../assets/images/team-4.jpg";

export default class Team extends React.Component {
  render() {
    return (
      <section id="team" className="wow fadeInUp">
        <div className="container">
          <div className="section-header">
            <h2>Our Team</h2>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="member">
                <div className="pic">
                  <img src={team_1} alt="" />
                </div>
                <div className="details">
                  <h4>Milica Lazić</h4>
                  <span>Chief Executive Officer</span>
                  <div className="social">
                    <a href="">
                      <i className="fa fa-twitter" />
                    </a>
                    <a href="">
                      <i className="fa fa-facebook" />
                    </a>
                    <a href="">
                      <i className="fa fa-google-plus" />
                    </a>
                    <a href="">
                      <i className="fa fa-linkedin" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="member">
                <div className="pic">
                  <img src={team_2} alt="" />
                </div>
                <div className="details">
                  <h4>Nemanja Đuričić</h4>
                  <span>Product Manager</span>
                  <div className="social">
                    <a href="">
                      <i className="fa fa-twitter" />
                    </a>
                    <a href="">
                      <i className="fa fa-facebook" />
                    </a>
                    <a href="">
                      <i className="fa fa-google-plus" />
                    </a>
                    <a href="">
                      <i className="fa fa-linkedin" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="member">
                <div className="pic">
                  <img src={team_3} alt="" />
                </div>
                <div className="details">
                  <h4>Vladislav Milivojević</h4>
                  <span>CTO</span>
                  <div className="social">
                    <a href="">
                      <i className="fa fa-twitter" />
                    </a>
                    <a href="">
                      <i className="fa fa-facebook" />
                    </a>
                    <a href="">
                      <i className="fa fa-google-plus" />
                    </a>
                    <a href="">
                      <i className="fa fa-linkedin" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="member">
                <div className="pic">
                  <img src={team_4} alt="" />
                </div>
                <div className="details">
                  <h4>Stefan Kikanović</h4>
                  <span>Accountant</span>
                  <div className="social">
                    <a href="">
                      <i className="fa fa-twitter" />
                    </a>
                    <a href="">
                      <i className="fa fa-facebook" />
                    </a>
                    <a href="">
                      <i className="fa fa-google-plus" />
                    </a>
                    <a href="">
                      <i className="fa fa-linkedin" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
