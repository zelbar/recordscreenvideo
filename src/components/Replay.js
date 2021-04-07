import React from 'react';
import { VideoStorage } from '../store/VideoStorage';
import './replay.css';

const Replay = props => (
  <div>
    <video src={VideoStorage.objectUrl} autoPlay controls loop />
  </div>
);

export default Replay;
