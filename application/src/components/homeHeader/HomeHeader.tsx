import React from "react";
import "./homeHeader.scss";
import { Navbar } from "react-bootstrap";
import { LanguageSwitch } from "../languageSwitch/LanguageSwitch";
import { FormattedMessage } from "react-intl";

export class HomeHeader extends React.Component {
  render() {
    return (
      <Navbar id="homeHeaderNavbar" bg="dark" variant="dark">
        <Navbar.Brand>
          <FormattedMessage
            id="navbar.brand"
            defaultMessage="Songbook Project"
          />
        </Navbar.Brand>
        <LanguageSwitch />
      </Navbar>
    );
  }
}
