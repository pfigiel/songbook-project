import React from "react";
import { Router, Route } from "react-router-dom";
import { appContext } from "../utils/AppContext";
import { config } from "../utils/config";
import { Home } from "./Home";
import { Dashboard } from "./Dashboard";
import { SongScreen } from "./SongScreen";
import { Provider } from "react-redux";
import { store } from "../store/index";

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={appContext.history}>
          <Route exact path={config.clientRoutes.home} component={Home} />
          <Route
            exact
            path={config.clientRoutes.dashboard}
            component={Dashboard}
          />
          <Route exact path={config.clientRoutes.song} component={SongScreen} />
        </Router>
      </Provider>
    );
  }
}
