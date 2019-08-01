import React from "react";
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import de from "react-intl/locale-data/pl";
import messages_pl from "../translations/pl.json";
import messages_en from "../translations/en.json";
import { withCookies } from "react-cookie";
import { languageNames } from "../utils/LanguageNames";

addLocaleData([...en, ...de]);

const CurrentLanguage = (cookies: any) => {
    let lang = cookies.get("lang") || navigator.language.split(/[-_]/)[0];
    return lang=== languageNames.pl ? languageNames.pl : languageNames.en;
};

const Context = React.createContext();

class IntlProviderWrapper extends React.Component {
    constructor(props) {
        super(props);

        const { cookies } = props;
        this.lang = CurrentLanguage(cookies);

        this.switchToEnglish = () => {
            this.setState({ locale: LanguageNames.EN, messages: messages_en });
            cookies.set("lang", LanguageNames.EN);
        };

        this.switchToPolish = () => {
            this.setState({ locale: LanguageNames.PL, messages: messages_pl });
            cookies.set("lang", LanguageNames.PL);
        };

        this.state = {
            locale: this.lang,
            messages: this.lang === LanguageNames.PL ? messages_pl: messages_en,
            switchToEnglish: this.switchToEnglish,
            switchToPolish: this.switchToPolish
        };
    }

    render() {
        const { children } = this.props;
        const { locale, messages } = this.state;
        return (
            <Context.Provider value={this.state}>
                <IntlProvider
                    key={locale}
                    locale={locale}
                    messages={messages}
                    defaultLocale={this.lang}>
                    {children}
                </IntlProvider>
            </Context.Provider>
        );
    }
}

export default withCookies(IntlProviderWrapper);
export {Context as IntlContext};
export {CurrentLanguage};
