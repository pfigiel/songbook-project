import React from "react";
import "./header.scss";
import { Navbar } from "react-bootstrap";
import { LanguageSwitch } from "../languageSwitch/LanguageSwitch";
import { FormattedMessage } from "react-intl";

export class Header extends React.Component {
  render() {
    return (
      <Navbar id="headerNavbar" bg="dark" variant="dark">
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
