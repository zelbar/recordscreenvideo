import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Counter';

const About = props => (
  <div>
    <h1>About</h1>

    <p>This is a simple example Web API using <pre>getDisplayMedia()</pre>.</p>
  </div>
);

export default connect(
  state => state.about,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(About);
