import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Record from './components/Record';
import Replay from './components/Replay';
import Download from './components/Download';

export default () => (
  <Layout>
    <Route exact path='/record' component={Record} />
    <Route exact path='/replay' component={Replay} />
    <Route exact path='/download' component={Download} />
  </Layout>
);
