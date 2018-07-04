import React from "react";

export default class Footer extends React.Component {
  render() {
    return (
      <footer id="footer">
        <div className="container">
          <div className="copyright">
            &copy; Copyright <strong>Gibanica-Security</strong>. All Rights
            Reserved
          </div>
          <div className="credits" />
        </div>
      </footer>
    );
  }
}
