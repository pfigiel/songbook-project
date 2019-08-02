import React from "react";
import "./languageSwitch.scss";
import { Button } from "react-bootstrap";
import { appContext } from "../../utils/AppContext";

export class LanguageSwitch extends React.Component {
  render() {
    return (
      <div id="langSelectionDiv">
        <Button onClick={appContext.switchToPolish}>PL</Button>
        <Button onClick={appContext.switchToEnglish}>EN</Button>
      </div>
    );
  }
}
