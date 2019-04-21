import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Counter';
import { VideoStorage } from '../store/VideoStorage';
import './replay.css';

const Replay = props => (
  <div>
    <video src={VideoStorage.objectUrl} autoPlay controls loop />
  </div>
);

export default connect(
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Replay);
