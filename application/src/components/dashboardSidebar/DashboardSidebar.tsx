import React from "react";
import "./dashboardSidebar.scss";
import { Form, Button, FormControlProps } from "react-bootstrap";
import { IdentityService } from "../../services/identity/IdentityService";

interface IProps {}

interface IState {
    email: string;
    password: string;
    isLoggedIn: boolean;
}

export class DashboardSidebar extends React.Component<IProps, IState> {
    onEmailChange = (event: React.FormEvent<FormControlProps>) => {
        this.setState({ email: event.currentTarget.value as string })
    }

    onPasswordChange = (event: React.FormEvent<FormControlProps>) => {
        this.setState({ password: event.currentTarget.value as string })
    }

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        await new IdentityService().authenticate(this.state.email, this.state.password);
        // const response = await fetch("https://localhost:44340/identity/authenticate", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         Email: this.state.email,
        //         Password: this.state.password
        //     })
        // });
        // if (response.status === 200) {
        //     this.setState({ isLoggedIn: true });
        //     const loginData = await response.json();
        //     console.log(await response.json());
        // } else {
        //     console.error("UNAUTHORIZED");
        // }
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
                </Form>
            </div>
        );
    }
}