import "./styles/reset.scss";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/styles.scss";
import React from "react";
import ReactDOM from "react-dom";
import { addLocaleData } from "react-intl";
import { IntlProviderWrapper } from "./utils/IntlProviderWrapper";
import { App } from "./components/app/App";
import * as serviceWorker from "./serviceWorker";

addLocaleData([]);

ReactDOM.render(
    <IntlProviderWrapper>
      <App />
    </IntlProviderWrapper>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
