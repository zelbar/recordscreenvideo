import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as resolutionActionCreators, resolutions } from '../store/Resolution';
import { actionCreators as fileActionCreators } from '../store/File';
import { VideoStorage } from '../services/VideoStorage';
import { Advertisement, Button, Divider, Form, Grid, Header, Icon, Input, Radio, Responsive, Segment, Statistic } from 'semantic-ui-react/dist/commonjs';
import filesize from 'filesize';
import config from '../config';

const Save = props => {
  const handleSetResolution = (evt, { value }) => props.resolutionActions.setResolution(parseInt(value, 10));
  const handleSetWidth = (evt, { value }) => props.resolutionActions.setWidth(parseInt(value, 10));
  const handleSetHeight = (evt, { value }) => props.resolutionActions.setHeight(parseInt(value, 10));
  const handleSetFileName = (evt, { value }) => props.fileActions.setFileName(value);
  const SaveRecording = () => {
    console.log('Save recording.');
    const SaveLink = document.createElement('a');
    SaveLink.addEventListener('progress', e => console.log(e));
    SaveLink.href = VideoStorage.objectUrl;
    SaveLink.style = 'display: none';
    SaveLink.setAttribute('download', `${props.file.name}.${props.file.extension}`);
    document.body.appendChild(SaveLink);
    SaveLink.click();
    document.body.removeChild(SaveLink);
  };
  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column width={16}>
          {config.showResolutionPicker &&
            <Segment>
              <Header as='h3'>Resolution</Header>
              <Form>
                <Form.Group>
                  <Input
                    value={props.resolution.width}
                    onChange={handleSetWidth}
                    type='number'
                    size='mini'
                    icon='arrows alternate horizontal'
                    iconPosition='left'
                    placeholder='1920'
                  />
                  <Input
                    value={props.resolution.height}
                    onChange={handleSetHeight}
                    type='number'
                    size='mini'
                    icon='arrows alternate vertical'
                    iconPosition='left'
                    placeholder='1080'
                  />
                </Form.Group>
              </Form>
              <Divider horizontal>Standard formats</Divider>
              <Form>
                {resolutions.map(res =>
                  <Form.Field key={res.id}>
                    <Radio
                      label={res.label}
                      name='resolutionId'
                      value={res.id}
                      checked={res.id === props.resolution.id}
                      onChange={handleSetResolution}
                    />
                  </Form.Field>)}
              </Form>
            </Segment>}
          <Segment>
            <Header as='h3'>Video properties</Header>
            <Statistic.Group widths={5} size='mini'>
              <Statistic>
                <Statistic.Label>Width</Statistic.Label>
                <Statistic.Value>{props.resolution.width}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Height</Statistic.Label>
                <Statistic.Value>{props.resolution.height}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Format</Statistic.Label>
                <Statistic.Value>
                  {VideoStorage.type && VideoStorage.type.split('/')[1].split(';')[0]}
                </Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Codec</Statistic.Label>
                <Statistic.Value>
                  {VideoStorage.type && VideoStorage.type.includes('=') ?
                    VideoStorage.type.split('/')[1].split(';')[1].split('=')[1] : 'default'}
                </Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Size</Statistic.Label>
                <Statistic.Value>{filesize(VideoStorage.size)}</Statistic.Value>
              </Statistic>
            </Statistic.Group>
            <Header as='h3'>File name</Header>
            <Input
              value={props.file.name}
              onChange={handleSetFileName}
              fluid
              type='text'
              label={{ basic: true, content: `.${props.file.extension}` }}
              labelPosition='right'
            />
          </Segment>
          <Button
            fluid
            icon
            disabled={VideoStorage.size === 0}
            labelPosition='right'
            color='blue'
            size='massive'
            onClick={SaveRecording}>
            <Icon name='download' />
            Save video file
          </Button>
        </Grid.Column>
      </Grid.Row>
      {config.showAds &&
        <Grid.Row>
          <Responsive {...Responsive.onlyComputer}>
            <Advertisement centered unit='billboard' test='Computer Billboard #2' />
          </Responsive>
          <Responsive {...Responsive.onlyTablet}>
            <Advertisement centered unit='large rectangle' test='Large Tablet Rectangle #2' />
          </Responsive>
          <Responsive {...Responsive.onlyMobile}>
            <Advertisement unit='mobile banner' test='Mobile Banner #1' />
          </Responsive>
        </Grid.Row>}
    </Grid>
  );
}

export default withRouter(connect(
  state => ({ resolution: state.resolution, file: state.file }),
  dispatch => ({ resolutionActions: bindActionCreators(resolutionActionCreators, dispatch), fileActions: bindActionCreators(fileActionCreators, dispatch) })
)(Save));