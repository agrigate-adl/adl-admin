import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'react-jss';
import Theme from 'resources/theme';
import Routes from 'routes';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import {persistor, store } from'./app/store'
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.render(
    <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={Theme}>
        <Router>
            <Routes />
        </Router>
    </ThemeProvider>
    </PersistGate>
    </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

serviceWorker.unregister();
