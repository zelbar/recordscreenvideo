import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as resolutionActionCreators, resolutions } from '../store/Resolution';
import { actionCreators as fileActionCreators } from '../store/File';
import { VideoStorage } from '../store/VideoStorage';
import { Advertisement, Button, Divider, Form, Grid, Header, Icon, Input, Radio, Responsive, Segment, Statistic } from 'semantic-ui-react/dist/commonjs';
import filesize from 'filesize';
import config from '../config';

export class Download extends Component {
  handleSetResolution = (evt, { value }) => this.props.resolutionActions.setResolution(parseInt(value, 10));
  handleSetWidth = (evt, { value }) => this.props.resolutionActions.setWidth(parseInt(value, 10));
  handleSetHeight = (evt, { value }) => this.props.resolutionActions.setHeight(parseInt(value, 10));
  handleSetFileName = (evt, { value }) => this.props.fileActions.setFileName(value);
  downloadRecording = () => {
    console.log('Download recording.');

    const downloadLink = document.createElement('a');
    downloadLink.addEventListener('progress', e => console.log(e));
    downloadLink.href = VideoStorage.objectUrl;
    downloadLink.style = 'display: none';
    downloadLink.setAttribute('download', `${this.props.file.name}.${this.props.file.extension}`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    //this.props.history.push('/share');
  };

  render() {
    return (
      <Grid stackable relaxed='very'>
        <Grid.Column width={config.showAds ? 6 : 16}>
          {config.showResolutionPicker && 
          <Segment>
            <Header>Resolution</Header>
            <Form>
              <Form.Group>
                <Input
                  value={this.props.resolution.width}
                  onChange={this.handleSetWidth}
                  type='number'
                  size='mini'
                  icon='arrows alternate horizontal'
                  iconPosition='left'
                  placeholder='1920'
                />
                <Input
                  value={this.props.resolution.height}
                  onChange={this.handleSetHeight}
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
                    checked={res.id === this.props.resolution.id}
                    onChange={this.handleSetResolution}
                  />
                </Form.Field>)}
            </Form>
          </Segment>}
          <Segment>
            <Header>Video properties</Header>
            <Statistic.Group widths={5} size='mini'>
              <Statistic>
                <Statistic.Label>Width</Statistic.Label>
                <Statistic.Value>{this.props.resolution.width}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Height</Statistic.Label>
                <Statistic.Value>{this.props.resolution.height}</Statistic.Value>
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
            <Header>File name</Header>
            <Input
              value={this.props.file.name}
              onChange={this.handleSetFileName}
              fluid
              type='text'
              label={{ basic: true, content: `.${this.props.file.extension}` }}
              labelPosition='right'
            />
          </Segment>
          {true &&
            <Button
              fluid
              icon
              disabled={VideoStorage.size === 0}
              labelPosition='right'
              color='green'
              size='massive'
              onClick={this.downloadRecording}>
              <Icon name='download' />
              Download
            </Button>}
          {config.showAds && <div>
            <Divider />
            <Responsive {...Responsive.onlyComputer}>
              <Advertisement centered unit='medium rectangle' test='Medium Rectangle' />
            </Responsive>
            <Responsive {...Responsive.onlyTablet}>
              <Advertisement centered unit='small rectangle' test='Small Mobile Rectangle' />
            </Responsive>
          </div>}
        </Grid.Column>
        {config.showAds &&
          <Grid.Column width={10}>
            <Responsive {...Responsive.onlyComputer}>
              <Advertisement centered unit='netboard' test='Computer Netboard #2' />
            </Responsive>
            <Responsive {...Responsive.onlyTablet}>
              <Advertisement centered unit='large rectangle' test='Large Tablet Rectangle' />
            </Responsive>
            <Responsive {...Responsive.onlyMobile}>
              <Advertisement centered unit='half banner' test='Half Mobile Banner' />
            </Responsive>
          </Grid.Column>}
      </Grid>
    );
  }
}

export default withRouter(connect(
  state => ({ resolution: state.resolution, file: state.file }),
  dispatch => ({ resolutionActions: bindActionCreators(resolutionActionCreators, dispatch), fileActions: bindActionCreators(fileActionCreators, dispatch) })
)(Download));