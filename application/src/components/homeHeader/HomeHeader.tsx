import React from "react";
import "./homeHeader.scss";
import { Navbar } from "react-bootstrap";

export class HomeHeader extends React.Component {
    render() {
        return (
            <Navbar id="homeHeaderNavbar" bg="dark" variant="dark">
                <Navbar.Brand>Songbook Project</Navbar.Brand>
            </Navbar>
        );
    }
}