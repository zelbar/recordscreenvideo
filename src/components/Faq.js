import React from 'react';
import { Grid, Header, List } from 'semantic-ui-react/dist/commonjs';

const Faq = () => (
  <div>
    <Header as='h1'>Frequently asked questions</Header>
    <Grid relaxed stackable columns={2}>
      <Grid.Column>
        <Header as='h4'>Which platforms, operating systems and browsers are supported?</Header>
        <p>
          Any desktop operating system with a modern web browser is supported.
        </p>
        <p>
          Currently supported browsers</p>
          <List bulleted>
            <List.Item>Chromium-based browsers (e.g. Chrome, Edge)</List.Item>
            <List.Item>Firefox</List.Item>
            <List.Item>Opera</List.Item>
          </List>
        <p>Only recent versions of desktop browsers are supported. Mobile browsers and operating systems are currently not supported.</p>
      </Grid.Column>
      <Grid.Column>
        <Header as='h4'>Which video formats and codecs are supported?</Header>
        <p>Supported video formats</p>
            <List bulleted>
            <List.Item>WebM</List.Item>
            <List.Item>Matroska (Chrome)</List.Item>
          </List>
        <p>Supported video codecs</p>
            <List bulleted>
            <List.Item>VP8</List.Item>
            <List.Item>VP9</List.Item>
            <List.Item>AVC (Advanced Video Codec)</List.Item>
            <List.Item>H.264</List.Item>
          </List>
      </Grid.Column>
      <Grid.Column>
        <Header as='h4'>Why can't I select some video formats?</Header>
        <p>Only formats supported by your web browser can be selected. Video format and codec support vary by web browser and version.</p>
      </Grid.Column>
      <Grid.Column>
        <Header as='h4'>Why is there no audio in the recording?</Header>
        <p>Audio recording is supported only by Chromium-based browsers when recording a screen or browser tab. To record audio, make sure you enable the <strong>Share audio</strong> option when picking the content you want to record.</p>
      </Grid.Column>
      <Grid.Column>
        <Header as='h4'>Can I include my microphone audio in the recording?</Header>
        <p>Not yet, but this feature is on the priority list.</p>
      </Grid.Column>
      <Grid.Column>
        <Header as='h4'>I'm concerned about privacy. Where are videos stored and who can access them?</Header>
        <p>Videos are stored only in your web browser. No one except you can accesss them. They are never uploaded, stored or processed on the server.</p>
      </Grid.Column>
    </Grid>
  </div>
);

export default Faq;
