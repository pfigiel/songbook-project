import React from "react";
import { Router, Route } from "react-router-dom";
import { appContext } from "./AppContext";
import { config } from "./utils/config";
import { Home } from "./components/home/Home";
import { Dashboard } from "./components/dashboard/Dashboard";

export class App extends React.Component {
  render() {
    return (
      <Router history={ appContext.history }>
        <Route exact path={ config.clientRoutes.home } component={Home} />
        <Route exact path={ config.clientRoutes.dashboard } component={Dashboard} />
      </Router>
    );
  }
}