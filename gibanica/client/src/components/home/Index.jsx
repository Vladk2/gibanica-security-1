import React from "react";
import IntroContent from "../home/sections/IntroContent";
import About from "../home/sections/About";
import Services from "../home/sections/Services";
import Team from "../home/sections/Team";
import Contact from "../home/sections/Contact";
import Footer from "../home/sections/Footer";
import "../../App.css";

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <main id="main">
          <IntroContent />
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
