import React, { FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';

const Home: FunctionComponent = () => {
  return <Redirect to="/login" />;
};

export default Home;
