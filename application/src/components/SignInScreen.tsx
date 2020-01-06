import React from "react";
import { appContext } from "../utils/AppContext";
import { IdentityService } from "../services/identity/IdentityService";
import { AuthenticateResult } from "../services/identity/AuthenticateResult";
import { FormattedMessage } from "react-intl";
import { config } from "../utils/config";
import { Header } from "./Header";

interface IProps { }

export class SignInScreen extends React.Component<IProps> {
    state = {
        email: "",
        password: "",
        isLoginWrongCredentialsError: false,
        isLoginServerError: false
    };

    identityService: IdentityService;

    constructor(props: IProps) {
        super(props);
        this.identityService = new IdentityService();
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
            appContext.history.push(config.clientRoutes.dashboard);
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

    render() {
        return (
            <>
            <Header />
                <div id="signInScreen">
                    <form onSubmit={this.onSubmit}>
                        <label>
                            <FormattedMessage
                                id="identity.emailAddress"
                                defaultMessage="Email address" />
                        </label>
                        <input
                            type="email"
                            onChange={this.onEmailChange}
                        />
                        <label>
                            <FormattedMessage
                                id="identity.password"
                                defaultMessage="Password" />
                        </label>
                        <input
                            type="password"
                            onChange={this.onPasswordChange}
                        />
                        <button type="submit">
                            <FormattedMessage
                                id="identity.signIn"
                                defaultMessage="Sign in" />
                        </button>
                        {this.state.isLoginWrongCredentialsError && (
                            <FormattedMessage
                                id="identity.wrongCredentials"
                                defaultMessage="Incorrect email or password" />
                        )}
                    </form>
                </div>
            </>
        );
    }
}
