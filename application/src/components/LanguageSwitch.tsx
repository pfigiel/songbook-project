import React from "react";
import { appContext } from "../utils/AppContext";

export class LanguageSwitch extends React.Component {
  render() {
    return (
      <div id="langSelectionDiv">
        <button onClick={appContext.switchToPolish}>PL</button>
        <button onClick={appContext.switchToEnglish}>EN</button>
      </div>
    );
  }
}
