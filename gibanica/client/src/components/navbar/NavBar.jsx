import React from "react";
import { logout } from "../../util/UserApi";
import { Nav, Navbar, NavDropdown, NavItem, MenuItem } from "react-bootstrap";

export default class NavBar extends React.Component {
  sign_out = () => {
    logout();
    window.location.replace("/");
  };

  isAdmin = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      return true;
    }

    return false;
  };

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Gibanica Security</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="/logs">
            Logs
          </NavItem>
          <NavItem eventKey={2} href="/alarms">
            Alarms
          </NavItem>
          {this.isAdmin() ? (
            <NavItem eventKey={3} href="/agents">
              Agents
            </NavItem>
          ) : null}
        </Nav>
        <Nav pullRight>
          <NavDropdown
            style={{
              paddingRight: 32
            }}
            eventKey={3}
            title="Account"
            id="basic-nav-dropdown"
          >
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.4} onClick={this.sign_out}>
              Sign Out
            </MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}
