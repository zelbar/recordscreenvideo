import React from 'react';
import Steps from './Steps';
import { Container, Grid } from 'semantic-ui-react/dist/commonjs';

export default props => (
  <Grid>
    <Grid.Column mobile={4} tablet={16} computer={16}>
      <Steps />
    </Grid.Column>
    <Grid.Column mobile={12} tablet={16} computer={16}>
      <Container>
        {props.children}
      </Container>
    </Grid.Column>
  </Grid>
);
