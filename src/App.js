import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Record from './components/Record';
import RedirectToRecord from './components/RedirectToRecord';
import Replay from './components/Replay';
import Save from './components/Save';
import Share from './components/Share';
import HowItWorks from './components/HowItWorks';
import Faq from './components/Faq';
import Privacy from './components/Privacy';

export default () => (
  <Layout>
    <Route exact path='/record' component={Record} />
    <Route exact path='/' component={RedirectToRecord} />
    <Route exact path='/replay' component={Replay} />
    <Route exact path='/save' component={Save} />
    <Route exact path='/share' component={Share} />
    <Route exact path='/how-it-works' component={HowItWorks} />
    <Route exact path='/faq' component={Faq} />
    <Route exact path='/privacy' component={Privacy} />
  </Layout>
);
