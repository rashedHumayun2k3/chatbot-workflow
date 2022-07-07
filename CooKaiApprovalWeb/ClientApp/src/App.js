import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as microsoftTeams from '@microsoft/teams-js';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Layout from './Components/layout-component/layout';
import store from './store/configure-store';
import SecureRoute from './helpers/SecureRoute';
import Login from './Components/pages/auth/login';
import SignInStart from './Components/pages/auth/sign-in-start';
import SignInEnd from './Components/pages/auth/sign-in-end';
import CreateRequest from './Components/create-request/create-request';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});
const App = () => {
  initializeIcons();
  microsoftTeams.initialize();

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signinstart" component={SignInStart} />
          <Route exact path="/signinend" component={SignInEnd} />
          <Switch>
            <SecureRoute exact path="/" component={Layout} />
            <SecureRoute
              exact
              path="/create-request"
              component={CreateRequest}
            />
          </Switch>
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
