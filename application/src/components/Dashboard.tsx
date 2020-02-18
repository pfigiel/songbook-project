import React from "react";
import { Header } from "./Header";
import { SongsList } from "./SongsList";
import { IdentityService } from "../services/identity/IdentityService";
import { connect } from "react-redux";
import { State } from "../store/models/State";

interface IProps {
  isLoggedIn: boolean;
}

const mapStateToProps = (state: State) => {
  return {
    isLoading: false,
    user: state.user
  };
};

const headerHOC = connect(mapStateToProps)(Header);

export class Dashboard extends React.Component {
  identityService: IdentityService;

  constructor(props: IProps) {
    super(props);
    this.identityService = new IdentityService();
  }

  render() {
    return (
      <div>
        <Header/>
        <div id="dashboardWrapper">
          <SongsList />
        </div>
      </div>
    );
  }
}
