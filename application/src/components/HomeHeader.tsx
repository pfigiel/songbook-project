import React from "react";
import { LanguageSwitch } from "./LanguageSwitch";
import { FormattedMessage } from "react-intl";

export class HomeHeader extends React.Component {
  render() {
    return (
      <div id="homeHeaderNavbar">
        <div id="brandName">
          <FormattedMessage
            id="navbar.brand"
            defaultMessage="Songbook Project"
          />
        </div>
        <LanguageSwitch />
      </div>
    );
  }
}
