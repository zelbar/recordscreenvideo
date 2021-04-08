import React from 'react';
import { VideoStorage } from '../services/VideoStorage';
import './replay.css';

const Replay = () => (
  <div>
    <video src={VideoStorage.objectUrl} autoPlay controls loop />
  </div>
);

export default Replay;
