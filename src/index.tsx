import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'fontsource-roboto';
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import * as serviceWorker from './serviceWorker';
import { options } from './theme';
import App from './App';
import { store } from './store';
import { SnackbarProvider } from 'notistack';

const theme = createMuiTheme(options);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          
          <App />
        
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
