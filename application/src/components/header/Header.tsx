import React from "react";
import "./header.scss";
import { Navbar } from "react-bootstrap";

export class Header extends React.Component {
    render() {
        return (
            <Navbar id="headerNavbar" bg="dark" variant="dark">
                <Navbar.Brand>Songbook Project</Navbar.Brand>
            </Navbar>
        );
    }
}