import React from "react";
import { Header } from "./Header";
import { SongsList } from "./SongsList";
import { IdentityService } from "../services/identity/IdentityService";
import { StorageService } from "../services/StorageService";

interface IProps {
  isLoggedIn: boolean;
}

export class Dashboard extends React.Component {
  identityService: IdentityService;

  constructor(props: IProps) {
    super(props);
    this.identityService = new IdentityService();
  }

  render() {
    return (
      <div>
        <Header />
        <div id="dashboardWrapper">
          <SongsList />
        </div>
      </div>
      
    );
  }
}
