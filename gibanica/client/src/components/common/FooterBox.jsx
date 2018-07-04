import React from "react";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Title from "grommet/components/Title";
import Footer from "grommet/components/Footer";

import logo from "../../assets/images/logo.png";

export default class FooterBox extends React.Component {
  render() {
    return (
      <Footer justify="between" size="small">
        <Title>
          <img src={logo} alt="" width={80} height={45} />
        </Title>
        <Box direction="row" align="center" pad={{ between: "medium" }}>
          <Paragraph margin="none">© 2018 Gibanica Security</Paragraph>
        </Box>
      </Footer>
    );
  }
}
