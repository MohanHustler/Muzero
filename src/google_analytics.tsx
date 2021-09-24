import React, { FunctionComponent, useEffect, Fragment } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE as string);

interface Props extends RouteComponentProps {
  children: React.ReactNode;
}

const GoogleAnalytics: FunctionComponent<Props> = ({ children }) => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  });
  return <Fragment>{children}</Fragment>;
};

export default withRouter(GoogleAnalytics);
