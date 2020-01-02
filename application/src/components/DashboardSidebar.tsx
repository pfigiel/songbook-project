import React, { SyntheticEvent, ChangeEvent } from "react";
import { IdentityService } from "../services/identity/IdentityService";
import { AuthenticateResult } from "../services/identity/AuthenticateResult";
import { connect } from "react-redux";
import { State } from "../store/models/State";
import { FormattedMessage } from "react-intl";

interface IProps {
  isLoggedIn: boolean;
}

interface IState {
  email: string;
  password: string;
  isLoginWrongCredentialsError: boolean;
  isLoginServerError: boolean;
}

const mapStateToProps = (state: State) => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

class ConnectedDashboardSidebar extends React.Component<IProps, IState> {
  state = {
    email: "",
    password: "",
    isLoginWrongCredentialsError: false,
    isLoginServerError: false
  };

  identityService: IdentityService;

  constructor(props: IProps, state: IState) {
    super(props, state);
    this.identityService = new IdentityService();
  }

  async componentDidMount() {
    // await this.identityService.validateToken();
  }

  onEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ email: event.currentTarget.value as string });
  };

  onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ password: event.currentTarget.value as string });
  };

  onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const result = await this.identityService.authenticate(
      this.state.email,
      this.state.password
    );
    if (result.isSuccess) {
      this.setState({
        isLoginWrongCredentialsError: false,
        isLoginServerError: false
      });
    } else {
      switch (result.error) {
        case AuthenticateResult.WRONG_CREDENTIALS:
          this.setState({
            isLoginWrongCredentialsError: true,
            isLoginServerError: false
          });
          break;
        case AuthenticateResult.SERVER_ERROR:
          this.setState({
            isLoginServerError: true,
            isLoginWrongCredentialsError: false
          });
          break;
      }
    }
  };

  signOut = async () => {
    await this.identityService.signOut();
  };

  render() {
    return (
      <div id="dashboardSidebarWrapper">
        {!this.props.isLoggedIn ? (
          <form onSubmit={this.onSubmit}>
            <label>
              <FormattedMessage
                id="dashboardSidebar.emailAddress"
                defaultMessage="Email address" />
            </label>
            <input
              type="email"
              onChange={this.onEmailChange}
            />
            <label>
            <FormattedMessage
                id="dashboardSidebar.password"
                defaultMessage="Password" />
            </label>
            <input
              type="password"
              onChange={this.onPasswordChange}
            />
            <button type="submit">
            <FormattedMessage
                id="dashboardSidebar.signIn"
                defaultMessage="Sign in" />
            </button>
            {this.state.isLoginWrongCredentialsError && (
              <FormattedMessage
                id="dashboardSidebar.wrondCredentials"
                defaultMessage="Incorrect email or password" />
            )}
          </form>
        ) : (
          <button onClick={this.signOut}>
            <FormattedMessage
                id="dashboardSidebar.signOut"
                defaultMessage="Sign out" />
          </button>
        )}
      </div>
    );
  }
}

const DashboardSidebar = connect(mapStateToProps)(ConnectedDashboardSidebar);
export { DashboardSidebar };
