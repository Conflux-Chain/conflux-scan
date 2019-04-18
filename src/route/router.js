import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Blog from '../pages/Blog';
import Media from '../pages/Media';
import Teams from '../pages/Teams';
import JoinUs from '../pages/JoinUs';
import Privacy from '../pages/Privacy';
import Policy from '../pages/Policy';
import Faqs from '../pages/Faqs';

function Router() {
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
}
export default Router;
