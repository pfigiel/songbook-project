import React from "react";
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import pl from "react-intl/locale-data/pl";
import messages_pl from "../translations/pl.json";
import messages_en from "../translations/en.json";
import { appContext } from "./AppContext";
import { languageNames } from "./languageNames";
import { cookieNames } from "./cookieNames";

addLocaleData([...en, ...pl]);

const CurrentLanguage = () => {
  let lang = appContext.cookies.get(cookieNames.language) || navigator.language.split(/[-_]/)[0];
  return lang === languageNames.pl ? languageNames.pl : languageNames.en;
};

interface IState {
  locale: string;
  messages: object;
  switchToEnglish(): void;
  switchToPolish(): void;
}

export class IntlProviderWrapper extends React.Component {
  public state: IState = {
    locale: "",
    messages: {},
    switchToEnglish: () => {},
    switchToPolish: () => {}
  };

  constructor(props: any) {
    super(props);
    appContext.initializeLanguageSwitches(
      this.switchToPolish,
      this.switchToEnglish
    );
  }

  componentDidMount() {
    const currentLanguage = appContext.cookies.get(cookieNames.language);
    if (currentLanguage && currentLanguage !== "") {
      currentLanguage === languageNames.en
        ? this.switchToEnglish()
        : this.switchToPolish();
    } else {
      this.switchToEnglish();
    }
  }

  switchToEnglish = (): void => {
    this.setState({ locale: languageNames.en, messages: messages_en });
    appContext.cookies.set(cookieNames.language, languageNames.en);
  };

  switchToPolish = (): void => {
    this.setState({ locale: languageNames.pl, messages: messages_pl });
    appContext.cookies.set(cookieNames.language, languageNames.pl);
  };

  render() {
    return (
      <IntlProvider
        key={this.state.locale ? this.state.locale : languageNames.en}
        locale={this.state.locale ? this.state.locale : languageNames.en}
        messages={this.state.messages}
      >
        {this.props.children}
      </IntlProvider>
    );
  }
}

export { CurrentLanguage };
