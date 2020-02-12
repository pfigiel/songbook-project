import React from "react";
import { LanguageSwitch } from "./LanguageSwitch";
import { FormattedMessage } from "react-intl";
import { State } from "../store/models/State";
import { connect } from "react-redux";
import { StorageService } from "../services/StorageService";
import { config } from "../utils/config";
import { IdentityService } from "../services/identity/IdentityService";
import { User } from "../models/User";

interface IProps {
  isLoggedIn: boolean;
  user: User;
}

const mapStateToProps = (state: State) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user
  };
};

class UnconnectedHeader extends React.Component<IProps> {
  identityService: IdentityService;

  constructor(props: IProps) {
    super(props);
    this.identityService = new IdentityService();
  }

  onSignOutButtonClick = async () => {
    const signOutResult = await this.identityService.signOut();
  }

  render() {
    return (
      <div id="header">
        <a id="brandName" href="/">
          <div>
            <FormattedMessage
              id="navbar.brand"
              defaultMessage="Songbook Project"
            />
          </div>
        </a>
        <div>
          {!this.props.isLoggedIn ? (
            <div>
              <a href={config.clientRoutes.signIn}>
                <FormattedMessage id="identity.signIn" defaultMessage="Sign in" />
              </a>
              <a href={config.clientRoutes.register}>
                <FormattedMessage id="identity.createAccount" defaultMessage="Create account" />
              </a>
            </div>
          ) : (
              <div>
                <span>{this.props.user.email}</span>
                <a onClick={this.onSignOutButtonClick}>
                  <FormattedMessage id="identity.signOut" defaultMessage="Sign out" />
                </a>
              </div>
            )}
          <LanguageSwitch />
        </div>
      </div>
    );
  }
}

const Header = connect(mapStateToProps)(UnconnectedHeader);
export { Header };