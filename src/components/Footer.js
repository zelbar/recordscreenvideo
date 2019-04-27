import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react/dist/commonjs';

const Footer = props => (
  <Grid centered>
      <Link to='/how-it-works'>How it works</Link>
      <Link to='/faq'>FAQ</Link>
      <Link to='/privacy'>Privacy</Link>
  </Grid>
);

export default Footer;
