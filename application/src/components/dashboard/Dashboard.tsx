import React from "react";
import "./dashboard.scss";
import { Header } from "../header/Header";
import { Container, Row, Col } from "react-bootstrap";
import { DashboardSidebar } from "../dashboardSidebar/DashboardSidebar";
import { SongsList } from "../songsList/SongsList";

export class Dashboard extends React.Component {
  render() {
    return (
      <div id="dashboardWrapper">
        <Header />
        <Container>
          <Row>
            <Col sm="3">
              <DashboardSidebar />
            </Col>
            <Col sm="9">
                <SongsList />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
