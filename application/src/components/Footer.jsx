import React from "react";
import { FormattedMessage } from "react-intl";

export class Footer extends React.Component {
    render() {
        return (
            <div id="footer">
                Copyrignt Songbook Project.{" "}
                <FormattedMessage id="footer.allRightsReserved" defaultMessage="All rights reserved" />
            </div>
        );
    }
}