import React from "react";
import { appContext } from "../utils/AppContext";
import { IdentityService } from "../services/identity/IdentityService";
import { FormattedMessage } from "react-intl";
import { config } from "../utils/config";
import { Header } from "./Header";

interface IProps { }

export class RegisterScreen extends React.Component<IProps> {
    state = {
        email: "",
        password: "",
        confirmedPassword: "",
        isRegisterError: false
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

    onConfirmedPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ confirmedPassword: event.currentTarget.value });
    }

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ isRegisterError: false });
        const result = await this.identityService.register(
            this.state.email,
            this.state.password
        );
        if (result.isSuccess) {
            appContext.history.push(config.clientRoutes.signIn);
        } else {
            this.setState({ isRegisterError: true });
        }
    };

    render() {
        return (
            <>
                <Header />
                <div id="registerScreen">
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
                        <label>
                            <FormattedMessage
                                id="identity.confirmPassword"
                                defaultMessage="Password" />
                        </label>
                        <input
                            type="password"
                            onChange={this.onConfirmedPasswordChange}
                        />
                        <button type="submit"
                            disabled={this.state.password !== this.state.confirmedPassword || this.state.password === ""}>
                            <FormattedMessage
                                id="identity.createAccount"
                                defaultMessage="Create account" />
                        </button>
                        {this.state.isRegisterError && (
                            <FormattedMessage
                                id="identity.registerError"
                                defaultMessage="Error while creating account, please try again" />
                        )}
                    </form>
                </div>
            </>
        );
    }
}
