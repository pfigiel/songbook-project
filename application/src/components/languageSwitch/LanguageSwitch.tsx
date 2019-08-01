import React from "react";
import { Button } from "react-bootstrap"
import { IntlContext } from "../../utils/intlContext";
import { languageNames } from "../../utils/LanguageNames";

const LanguageSwitch = () => {
    const { switchToEnglish, switchToPolish, locale } = React.useContext(IntlContext);
    const IsPL = locale === languageNames.pl;
    const IsEN = locale === languageNames.en;

    return (
        <div id="langSelectionDiv">
            <Button disabled={IsPL} onClick={switchToPolish}>
                POLISZ
            </Button>
            <Button disabled={IsEN} onClick={switchToEnglish}>
                INGLISZ
            </Button>
        </div>
    );
};

export default LanguageSwitch;
