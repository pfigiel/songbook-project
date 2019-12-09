import React from "react";
import { Header } from "./Header";
import { DashboardSidebar } from "./DashboardSidebar";
import { SongsList } from "./SongsList";

export class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div id="dashboardWrapper">
          <SongsList />
          <DashboardSidebar />
        </div>
      </div>
      
    );
  }
}
