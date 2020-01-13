import React from "react";
import { LanguageSwitch } from "./LanguageSwitch";
import { FormattedMessage } from "react-intl";
import { State, User } from "../store/models/State";
import { connect } from "react-redux";
import { config } from "../utils/config";
import { IdentityService } from "../services/identity/IdentityService";

interface IProps {
  isLoading: boolean;
  user: User
}

const mapStateToProps = (state: State) => {
  return {
    isLoading: false,
    user: state.user
  };
};

export class Header extends React.Component<IProps> {
  identityService: IdentityService;

  constructor(props: IProps) {
    super(props);
    console.log("ASDF");
    this.identityService = new IdentityService();
  }

  onSignOutButtonClick = async () => {
    const signOutResult = await this.identityService.signOut();
  }

  componentWillUnmount() {
    console.log("UN");
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
          {!this.props.user.isLoggedIn ? (
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

// const Header = connect(mapStateToProps)(UnconnectedHeader);
// export { Header };