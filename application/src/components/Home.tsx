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
                    <div id="goToDashboardSection">
                        <span>Songbook Project</span>
                        <button onClick={ () => appContext.history.push(config.clientRoutes.dashboard) }>
                            <FormattedMessage id="common.goToDashboard" defaultMessage="Go to Dashboard" />
                        </button>
                    </div>
                    <div id="testSection1">
                        <span>Lorem Ipsum</span>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                    <div id="testSection2">
                    <span>Lorem Ipsum</span>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                    <div id="testSection3">
                    <span>Lorem Ipsum</span>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}