import React from "react";
import { LanguageSwitch } from "./LanguageSwitch";
import { FormattedMessage } from "react-intl";

export class Header extends React.Component {
  render() {
    return (
      <div id="headerNavbar">
        <a id="brandName" href="/">
          <div>
            <FormattedMessage
              id="navbar.brand"
              defaultMessage="Songbook Project"
            />
          </div>
        </a>
        <LanguageSwitch />
      </div>
    );
  }
}
