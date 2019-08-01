import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from "react-intl";
import {  }
import { App } from './App';
import * as serviceWorker from './serviceWorker';

addLocaleData([])

ReactDOM.render(
    <IntlProvider locale="en">
        <App />
    </IntlProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
