import React from "react";
import { FormattedMessage } from "react-intl";
import { config } from "../utils/config";
import { appContext } from "../utils/AppContext";
import { HomeHeader } from "./HomeHeader";
import { Footer } from "./Footer";

export class Home extends React.Component {
    render() {
        return (
            <div>
                <HomeHeader />
                <div id="homeContent">
                    <button onClick={ () => appContext.history.push(config.clientRoutes.dashboard) }>
                        <FormattedMessage id="common.goToDashboard" defaultMessage="Go to Dashboard" />
                    </button>
                </div>
                <Footer />
            </div>
        );
    }
}