import React from "react";
import { Router, Route } from "react-router-dom";
import { appContext } from "../../utils/AppContext";
import { config } from "../../utils/config";
import { Home } from "../home/Home";
import { Dashboard } from "../dashboard/Dashboard";
import { SongScreen } from "../songScreen/SongScreen";

export class App extends React.Component {
  render() {
    return (
      <Router history={appContext.history}>
        <Route exact path={config.clientRoutes.home} component={Home} />
        <Route
          exact
          path={config.clientRoutes.dashboard}
          component={Dashboard}
        />
        <Route exact path={config.clientRoutes.song} component={SongScreen} />
      </Router>
    );
  }
}
