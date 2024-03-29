import React from 'react';
import Steps from './Steps';
import Social from './Social';
import Footer from './Footer';
import { withRouter } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react/dist/commonjs';

const Layout = props => (
  <Grid>
    <Grid.Column mobile={16} tablet={16} computer={16}>
      <Steps />
    </Grid.Column>
    <Grid.Column mobile={16} tablet={16} computer={16}>
      <Container>
        {props.children}
      </Container>
      {props.history.location.pathname !== '/replay' &&
        <Grid>
          <Grid.Row></Grid.Row>
          <Grid.Row centered>
            <Social />
          </Grid.Row>
        </Grid>}
    </Grid.Column>
    <Grid.Column mobile={16} tablet={16} computer={16}>
      <Footer />
    </Grid.Column>
  </Grid>
);

export default withRouter(Layout);