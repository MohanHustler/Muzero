import React from 'react';
import { routes } from './routes';
import { Bootstrap } from './bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom';
import GoogleAnalytics from './google_analytics';
import { useSnackbar } from 'notistack';
function App() {
  Bootstrap.init(); // Configure the application on the first page render.

  const { enqueueSnackbar } = useSnackbar();

  return (
    
    <Router>
      <GoogleAnalytics>
        <Switch>
          {routes.map((route) =>
            route.roles === undefined ? (
              <Route
                key={route.path}
                path={route.path}
                render={(props) => <route.component {...props} />}
              />
            ) : (
              <Route
                key={route.path}
                path={route.path}
                render={(props) => {
                  if (
                    route.roles?.includes(
                      localStorage.getItem('authUserRole') as string
                    )
                  ) {
                    return <route.component {...props} />;
                  } else {
                    enqueueSnackbar(
                      'Route not accessible , redirecting to dashboard',
                      { variant: 'warning' }
                    );
                    return (
                      <Redirect
                        to={{
                          pathname: '/profile/dashboard',
                          state: { from: props.location }
                        }}
                      />
                    );
                  }
                }}
              />
            )
          )}
        </Switch>
      </GoogleAnalytics>
    </Router>
  );
}

export default App;
