import React from 'react';
import ReactDOM from 'react-dom';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './main.less';

// Needed for React Developer Tools
window.React = React;

injectTapEventPlugin();

import App from './containers/App';
import Store from './stores/store';

// const store = configureStore();
const store = new Store();

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <App store={store} />
  </MuiThemeProvider>,
  document.getElementById('root')
);
