import React from "react";
import { FormattedMessage } from "react-intl";
import "./home.scss";
import { config } from "../../utils/config";
import { Button } from "react-bootstrap";
import { appContext } from "../../utils/AppContext";
import { HomeHeader } from "../homeHeader/HomeHeader";

export class Home extends React.Component {
    render() {
        return (
            <div>
                <HomeHeader />
                <div id="homeContent">
                    <Button onClick={ () => appContext.history.push(config.clientRoutes.dashboard) }>
                        <FormattedMessage id="home.goToDashboard" defaultMessage="Go to Dashboard" />
                    </Button>
                </div>
            </div>
        );
    }
}