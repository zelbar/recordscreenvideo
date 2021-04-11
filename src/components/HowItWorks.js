import React from 'react';
import { Container, Grid, Header, Item } from 'semantic-ui-react/dist/commonjs';

const HowItWorks = props => (
  <Container>
    <Grid>
      <Grid.Row>
        <Header as='h1'>How it works</Header>
      </Grid.Row>
      <Grid.Row>
        <Item.Group divided relaxed>
          <Item>
            <Item.Image src='/images/video-format-select.png' />
            <Item.Content>
              <Item.Header as='h4'>Select video format &amp; codec (optional)</Item.Header>
              <Item.Description>
                <p>Click the select box and pick desired video format and codec.</p>
                <p>You can also leave the default value.</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Image src='/images/start-button.png' />
            <Item.Content>
              <Item.Header as='h4'>Start recording</Item.Header>
              <Item.Description>
                <p>Click the 'Start' button.</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Image src='/images/share-screen.png' size='large' />
            <Item.Content>
              <Item.Header as='h4'>Share screen content and audio</Item.Header>
              <Item.Description>
                <p>Your browser will ask you which screen, application window or browser tab you want to share - this will be the recording area for your video.</p>
                <p>The video resolution will match the recording area.</p>
                <p>Enable the 'Share audio' option to include audio (if sharing a screen or browser tab).</p>
                <p>Click the 'Share' button</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='h4'>Perform recording</Item.Header>
              <Item.Description>
                <p>Your video is now being recorded.</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Image src='/images/stop-button.png' />
            <Item.Content>
              <Item.Header as='h4'>Stop recording</Item.Header>
              <Item.Description>
                <p>Click the 'Stop' button.</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='h4'>Preview recording</Item.Header>
              <Item.Description>
                <p>The recorded video will be played back to you.</p>
                <p>If you're not happy with the video, you can click the 'Record' button in the header menu and repeat the recording process.</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Image src='/images/save-step-button.png' />
            <Item.Content>
              <Item.Header as='h4'>Proceed to save</Item.Header>
              <Item.Description>
                <p>Click the 'Save' button in the header menu.</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Image src='/images/name-video-and-save.png' size='large' />
            <Item.Content>
              <Item.Header as='h4'>Name video and save file</Item.Header>
              <Item.Description>
                <p>Video properties are shown.</p>
                <p>Set the file name for the video (or leave default).</p>
                <p>Click the 'Save video file' button.</p>
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='h4'>Share on social media</Item.Header>
              <Item.Description>
                <p>Use the buttons below to share this app with colleagues and friends.</p>
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Grid.Row>
    </Grid>
  </Container>
);

export default HowItWorks;
