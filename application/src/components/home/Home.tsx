import React from "react";
import "./home.scss";
import { config } from "../../utils/config";
import { Button } from "react-bootstrap";
import { appContext } from "../../AppContext";
import { HomeHeader } from "../homeHeader/HomeHeader";

export class Home extends React.Component {
    render() {
        return (
            <div>
                <HomeHeader />
                <div id="homeContent">
                    <Button onClick={ () => appContext.history.push(config.clientRoutes.dashboard) }>Go to Dashboard</Button>
                </div>
            </div>
        );
    }
}