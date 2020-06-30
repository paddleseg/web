import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import store from './redux/store';
import routes from './routes';
import theme from './theme';

const history = createBrowserHistory();

ReactDOM.render(
    <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Router history={history}>
                    {renderRoutes(routes)}
                </Router>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    </StoreProvider>,
    document.querySelectorAll('.app')[0]
);

