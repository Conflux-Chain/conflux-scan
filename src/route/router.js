import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../pages/home';
import Blog from '../pages/blog';
import Media from '../pages/media';
import Teams from '../pages/teams';
import JoinUs from '../pages/joinus';
import Privacy from '../pages/privacy';
import Policy from '../pages/policy';
import Faqs from '../pages/faqs';

const Router = () => {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/teams" component={Teams} />
      <Route path="/joinus" component={JoinUs} />
      <Route path="/media" component={Media} />
      <Route path="/blog" component={Blog} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/policy" component={Policy} />
      <Route path="/faqs" component={Faqs} />
    </Switch>
  );
};
export default Router;
