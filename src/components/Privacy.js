import React from 'react';
import { Header } from 'semantic-ui-react/dist/commonjs';

const Privacy = props => (
  <div>
    <Header as='h1'>Privacy</Header>
    <Header as='h2'>Video privacy</Header>
    <p><strong>No videos is transmitted, stored or processed</strong> on servers. Videos are only available locally in your web browser until the browser is closed, after which videos are deleted.</p>
    <Header as='h2'>Cookies</Header>
    <p>We use cookies from Google Analytics in order to provide a better user experience.</p>
  </div>
);

export default Privacy;
