import React from "react";
import LoginForm from "./LoginForm";
import IntroContent from "../home/sections/IntroContent";
import About from "../home/sections/About";
import Services from "../home/sections/Services";
import Team from "../home/sections/Team";
import Contact from "../home/sections/Contact";
import Footer from "../home/sections/Footer";
import "../../App.css";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };
  }

  componentWillMount() {
    this.loggedIn();
  }

  loggedIn = () => {
    if (localStorage.getItem("token")) {
      this.setState({ loggedIn: true });
    }
  };

  render() {
    const { loggedIn } = this.state;
    return (
      <div>
        <main id="main">
          <IntroContent loggedIn={loggedIn} />
          <About />
          <Services />
          <Team />
          <Contact />

          <Footer />
        </main>
      </div>
    );
  }
}
