import React from 'react';
import { Redirect, Route } from 'react-router';
import Layout from './components/Layout';
import Record from './components/Record';
import Replay from './components/Replay';
import Download from './components/Download';
import Share from './components/Share';

export default () => (
  <Layout>
    <Route exact path='/record' component={Record} />
    <Redirect to='/record' />
    <Route exact path='/replay' component={Replay} />
    <Route exact path='/download' component={Download} />
    <Route exact path='/share' component={Share} />
  </Layout>
);
