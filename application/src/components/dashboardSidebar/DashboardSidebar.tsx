import React from "react";
import "./dashboardSidebar.scss";
import { Form, Button, FormControlProps } from "react-bootstrap";
import { IdentityService } from "../../services/identity/IdentityService";
import { AuthenticateResult } from "../../services/identity/AuthenticateResult";
import { connect } from "react-redux";
import { State } from "../../store/models/State";

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
    }
}

class ConnectedDashboardSidebar extends React.Component<IProps, IState> {
    state = {
        email: "",
        password: "",
        isLoginWrongCredentialsError: false,
        isLoginServerError: false
    }

    identityService: IdentityService;

    constructor(props: IProps, state: IState) {
        super(props, state);
        this.identityService = new IdentityService();
    }

    async componentDidMount() {
        await this.identityService.validateToken();
    }

    onEmailChange = (event: React.FormEvent<FormControlProps>) => {
        this.setState({ email: event.currentTarget.value as string })
    }

    onPasswordChange = (event: React.FormEvent<FormControlProps>) => {
        this.setState({ password: event.currentTarget.value as string })
    }

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const result = await this.identityService.authenticate(this.state.email, this.state.password);
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
    }

    render() {
        return (
            <div id="dashboardSidebarWrapper">
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="loginFormEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={this.onEmailChange} />
                    </Form.Group>
                    <Form.Group controlId="loginFormPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.onPasswordChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Log in
                    </Button>
                    { this.state.isLoginWrongCredentialsError && (
                        <p>Wrong credentials</p>
                    )}
                    { this.props.isLoggedIn && (
                        <p>Successfully logged in</p>
                    )}
                </Form>
            </div>
        );
    }
}

const DashboardSidebar = connect(
    mapStateToProps
)(ConnectedDashboardSidebar);
export { DashboardSidebar }